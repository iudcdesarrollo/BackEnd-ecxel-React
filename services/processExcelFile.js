const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const { Estado, Carrera, DatosPersonales } = require('../models/ModelDBWhatsappLedasCallCenter.js');
const reemplazos = require('../utils/remplazoCarreras.js');
const replacePostgraduateDegrees = require('./procesarPregunta.js');
const enviarMensajeHttpPost = require('./enviarMensajeHttpPost.js');
const mensajeAEnviar = require('./mensajePersonalisado.js');
const validacionNumber = require('../utils/validationNumbers.js');
const { v4: uuidv4 } = require('uuid');
const deletedFile = require('../utils/deletedFiles.js');

const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const dateInfo = new Date(utc_value * 1000);
    const fractionalDay = serial - Math.floor(serial) + 0.0000001;
    const time = 86400000 * fractionalDay;
    return new Date(dateInfo.getTime() + time);
};

const processExcelFile = async (filePath) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetNameList = workbook.SheetNames;
        const sheet = workbook.Sheets[sheetNameList[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const fechaPredeterminada = '2000-01-01 00:00:00';
        const processedData = [];

        let estado = await Estado.findOne({ where: { nombre: 'sin gestionar' } });
        if (!estado) {
            estado = await Estado.create({ nombre: 'sin gestionar' });
        }

        for (const row of data) {
            try {
                const {
                    NOMBRE,
                    APELLIDO,
                    CORREO,
                    TELEFONO,
                    CARRERA: CARRERA_NOMBRE,
                    IA,
                    'FECHA INGRESO IA': FECHA_INGRESO_IA,
                    'FECHA INGRESO META': FECHA_INGRESO_META
                } = row;

                if (!CARRERA_NOMBRE) {
                    console.log('CARRERA_NOMBRE no proporcionado para la fila:', row);
                    continue;
                }

                console.log('Datos de la fila:', {
                    NOMBRE,
                    APELLIDO,
                    CORREO,
                    TELEFONO,
                    CARRERA_NOMBRE,
                    FECHA_INGRESO_META
                });

                const postgraduateProcessed = await replacePostgraduateDegrees(CARRERA_NOMBRE, reemplazos);

                let carrera = await Carrera.findOne({ where: { nombre: postgraduateProcessed } });
                if (!carrera) {
                    carrera = await Carrera.create({ nombre: postgraduateProcessed });
                }

                const fechaIngresoMeta = FECHA_INGRESO_META ? excelDateToJSDate(FECHA_INGRESO_META) : fechaPredeterminada;
                const telefonoValido = validacionNumber(TELEFONO);

                const record = {
                    id: uuidv4(),
                    fecha_ingreso_meta: fechaIngresoMeta,
                    nombres: NOMBRE,
                    apellidos: APELLIDO,
                    correo: CORREO,
                    telefono: telefonoValido,
                    carrera: postgraduateProcessed,
                    estado: 'SIN GESTIONAR',
                    fecha_envio_what: null,
                    enviado: 0
                };

                console.log('Registro a buscar o crear:', record);

                const existingRecord = await DatosPersonales.findOne({
                    where: {
                        nombres: record.nombres,
                        apellidos: record.apellidos,
                        telefono: record.telefono,
                        carrera_id: carrera.id,
                        estado_id: estado.id
                    }
                });

                console.log('Registro existente encontrado:', existingRecord);

                if (!existingRecord || existingRecord.enviado === 0) {
                    const mensajeEnviaria = await mensajeAEnviar(NOMBRE, APELLIDO, postgraduateProcessed);
                    console.log('Mensaje a enviar:', mensajeEnviaria);

                    const responseHttp = await enviarMensajeHttpPost(record.id, telefonoValido, `${NOMBRE} ${APELLIDO}`, postgraduateProcessed, mensajeEnviaria);
                    console.log('Respuesta del envío de mensaje:', responseHttp);

                    if (responseHttp.message === 'Mensaje enviado exitosamente') {
                        record.fecha_envio_what = moment().format('YYYY-MM-DD HH:mm:ss');
                        record.enviado = 1;

                        if (existingRecord) {
                            await DatosPersonales.update({
                                fecha_envio_wha: record.fecha_envio_what,
                                enviado: true
                            }, {
                                where: {
                                    id: existingRecord.id
                                }
                            });
                            console.log('Registro actualizado:', existingRecord);
                        } else {
                            await DatosPersonales.create({
                                id: record.id,
                                fecha_ingreso_meta: record.fecha_ingreso_meta,
                                nombres: record.nombres,
                                apellidos: record.apellidos,
                                correo: record.correo,
                                telefono: record.telefono,
                                carrera_id: carrera.id,
                                estado_id: estado.id,
                                enviado: true,
                                fecha_envio_wha: record.fecha_envio_what
                            });
                            console.log('Nuevo registro creado:', record);
                        }
                    }
                } else {
                    console.log('Mensaje ya enviado, no se reenvía:', record);
                }

                processedData.push(record);
            } catch (rowError) {
                console.error('Error al procesar la fila:', row, 'Error:', rowError.message);
            }
        }

        const jsonFilePath = path.join(__dirname, '../temp', `datos_procesados_${moment().format('YYYYMMDD_HHmmss')}.json`);
        fs.writeFileSync(jsonFilePath, JSON.stringify(processedData, null, 2), 'utf8');
        console.log('Archivo JSON guardado en:', jsonFilePath);

        await deletedFile(filePath);

        return jsonFilePath;

    } catch (error) {
        console.error('Error al procesar el archivo Excel:', error.message);
        throw new Error('Error al procesar el archivo Excel: ' + error.message);
    }
};

module.exports = processExcelFile;