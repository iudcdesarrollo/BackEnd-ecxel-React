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
const getEstadoIdByName = require('../utils/getIdEstados.js');
const excelDateToJSDate = require('../utils/datesConverter.js');

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

        let estado = await Estado.findOne({ where: { nombre: 'no_gestionado' } });
        if (!estado) {
            estado = await Estado.create({ nombre: 'no_gestionado' });
        }

        const usuariosAEnviar = [];

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

                    await DatosPersonales.update({
                        fecha_ingreso_meta: record.fecha_ingreso_meta,
                        nombres: record.nombres,
                        apellidos: record.apellidos,
                        correo: record.correo,
                        carrera_id: record.carrera_id,
                        estado_id: record.estado_id,
                        enviado: false
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
                        enviado: false
                    });
                    console.log('Nuevo registro creado:', record);
                }

                usuariosAEnviar.push(record);
            } catch (rowError) {
                console.error('Error al procesar la fila:', row, 'Error:', rowError.message);
            }
        }

        for (const usuario of usuariosAEnviar) {
            try {
                let carrera = await Carrera.findOne({ where: { id: usuario.carrera_id } });
                carrera = carrera.nombre;
                //const mensajeEnviaria = await mensajeAEnviar(usuario.nombres, usuario.apellidos, await replacePostgraduateDegrees(carrera, reemplazos));

                const templateNammee = "bienvenida_1";

                const responseHttp = await enviarMensajeHttpPost(usuario.id, usuario.telefono, `${usuario.nombres} ${usuario.apellidos}`, carrera, templateNammee);
                console.log(`mensaje server de jesus: ${responseHttp.message}`);

                if (responseHttp.message === 'Mensaje enviado y guardado correctamente.') {
                    const mensajeAceptado = await getEstadoIdByName('MENSAJE_ACEPTADO');
                    usuario.fecha_envio_wha = moment().format('YYYY-MM-DD');
                    usuario.enviado = 1; // Asegúrate de que aquí se asigna un valor booleano o numérico correcto
                
                    await DatosPersonales.update({
                        fecha_envio_wha: usuario.fecha_envio_wha,
                        enviado: true, // Asegúrate de que esto es lo que deseas
                        estado_id: mensajeAceptado
                    }, {
                        where: {
                            id: usuario.id
                        }
                    });
                    console.log('Registro actualizado con mensaje enviado:', usuario);
                } else {
                    console.log('No se envió el mensaje. Respuesta del servidor:', responseHttp.message);
                }                

                processedData.push(usuario);
            } catch (sendError) {
                console.error('Error al enviar el mensaje para el usuario:', usuario, 'Error:', sendError.message);
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