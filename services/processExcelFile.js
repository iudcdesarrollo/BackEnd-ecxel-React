const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const { Estado, Carrera, DatosPersonales, Servicio } = require('../models/ModelDBWhatsappLedasCallCenter.js');
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

const processExcelFile = async (filePath, nameServicio) => {
    try {
        console.log(`Nombre del servicio recibido: ${nameServicio}`);

        let servicio = await Servicio.findOne({ where: { nombre: nameServicio } });
        if (!servicio) {
            servicio = await Servicio.create({ nombre: nameServicio });
        }

        console.log(`Servicio encontrado o creado: ${servicio.id}`);

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

        // Usamos un Set para asegurarnos de que solo se envíe un mensaje por número de teléfono
        const enviados = new Set();

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

                const postgraduateProcessed = await replacePostgraduateDegrees(CARRERA_NOMBRE, reemplazos);

                let carrera = await Carrera.findOne({ where: { nombre: postgraduateProcessed } });
                if (!carrera) {
                    carrera = await Carrera.create({ nombre: postgraduateProcessed });
                }

                const fechaIngresoMeta = FECHA_INGRESO_META ? excelDateToJSDate(FECHA_INGRESO_META) : fechaPredeterminada;
                const telefonoValido = validacionNumber(TELEFONO);

                if (enviados.has(telefonoValido)) {
                    console.log('Mensaje ya enviado a este número, no se reenvía:', telefonoValido);
                    continue;
                }
                
                const record = {
                    id: uuidv4(),
                    fecha_ingreso_meta: fechaIngresoMeta,
                    nombres: NOMBRE,
                    apellidos: APELLIDO,
                    correo: CORREO,
                    telefono: telefonoValido,
                    carrera_id: carrera.id,
                    estado_id: estado.id,
                    servicio_id: servicio.id,
                    enviado: 0
                };

                const existingRecord = await DatosPersonales.findOne({
                    where: {
                        telefono: record.telefono,
                        servicio_id: record.servicio_id
                    }
                });

                if (existingRecord) {
                    if (existingRecord.enviado === 1) {
                        console.log('Mensaje ya enviado, no se reenvía:', record);
                        continue;
                    }
                }

                const mensajeEnviaria = await mensajeAEnviar(NOMBRE, APELLIDO, postgraduateProcessed);

                const responseHttp = await enviarMensajeHttpPost(record.id, telefonoValido, `${NOMBRE} ${APELLIDO}`, postgraduateProcessed, mensajeEnviaria);
                console.log(`mensaje server de jesus: ${responseHttp.message}`);

                if (responseHttp.message === 'Mensaje enviado exitosamente') {
                    record.fecha_envio_wha = moment().format('YYYY-MM-DD HH:mm:ss');
                    record.enviado = 1;

                    if (existingRecord) {
                        await DatosPersonales.update({
                            fecha_envio_wha: record.fecha_envio_wha,
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
                            carrera_id: record.carrera_id,
                            estado_id: record.estado_id,
                            servicio_id: record.servicio_id,
                            enviado: true,
                            fecha_envio_wha: record.fecha_envio_wha
                        });
                        console.log('Nuevo registro creado:', record);
                    }

                    enviados.add(telefonoValido);
                } else {
                    console.log('No se envió el mensaje. Respuesta del servidor:', responseHttp.message);
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