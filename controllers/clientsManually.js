const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { Estado, Carrera, DatosPersonales, Servicio } = require('../models/ModelDBWhatsappLedasCallCenter.js');
const reemplazos = require('../utils/remplazoCarreras.js');
const replacePostgraduateDegrees = require('../services/procesarPregunta.js');
const validacionNumber = require('../utils/validationNumbers.js');
const enviarMensajeHttpPost = require('../services/enviarMensajeHttpPost.js');
const mensajeAEnviar = require('../services/mensajePersonalisado.js');
const obtenerFechaActual = require('../utils/obtenerFechaActual.js');

const manualCustomerEntry = async (req, res) => {
    const fechaActual = obtenerFechaActual();
    console.log(`Esta es la fecha actual: ${fechaActual}`);

    try {
        const { nombre, apellido, correo, telefono, posgradoInteres, fechaIngresoMeta, servicio } = req.body;

        if (!nombre || !apellido || !correo || !telefono || !posgradoInteres || !fechaIngresoMeta || !servicio) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        const telefonoValido = validacionNumber(telefono);
        if (!telefonoValido) {
            return res.status(400).json({ message: 'Número de teléfono no válido.' });
        }

        const nuevoId = uuidv4();

        let estado = await Estado.findOne({ where: { nombre: 'sin gestionar' } });
        if (!estado) {
            estado = await Estado.create({ id: uuidv4(), nombre: 'sin gestionar' });
        }

        const posgradoProcesado = await replacePostgraduateDegrees(posgradoInteres, reemplazos);

        let carrera = await Carrera.findOne({ where: { nombre: posgradoProcesado } });
        if (!carrera) {
            carrera = await Carrera.create({ id: uuidv4(), nombre: posgradoProcesado });
        }

        let servicioEncontrado = await Servicio.findOne({ where: { nombre: servicio } });
        if (!servicioEncontrado) {
            servicioEncontrado = await Servicio.create({ id: uuidv4(), nombre: servicio });
        }

        const mensajeEnviaria = await mensajeAEnviar(nombre, apellido, posgradoProcesado);

        const responseHttp = await enviarMensajeHttpPost(nuevoId, telefonoValido, `${nombre} ${apellido}`, posgradoProcesado, mensajeEnviaria);

        if (responseHttp.message === 'Mensaje enviado exitosamente') {
            const existingRecord = await DatosPersonales.findOne({
                where: {
                    nombres: nombre,
                    apellidos: apellido,
                    telefono: telefonoValido,
                    carrera_id: carrera.id,
                    estado_id: estado.id,
                    servicio_id: servicioEncontrado.id
                }
            });

            if (existingRecord) {
                await DatosPersonales.update({
                    correo: correo,
                    fecha_ingreso_meta: fechaIngresoMeta,
                    fecha_envio_wha: fechaActual,
                    enviado: true
                }, {
                    where: {
                        id: existingRecord.id
                    }
                });
                res.status(200).json({ message: 'Registro actualizado y mensaje enviado exitosamente.' });
            } else {
                await DatosPersonales.create({
                    id: nuevoId,
                    nombres: nombre,
                    apellidos: apellido,
                    correo: correo,
                    telefono: telefonoValido,
                    carrera_id: carrera.id,
                    estado_id: estado.id,
                    servicio_id: servicioEncontrado.id,
                    enviado: true,
                    fecha_ingreso_meta: fechaIngresoMeta,
                    fecha_envio_wha: fechaActual
                });
                res.status(201).json({ message: 'Nuevo registro creado y mensaje enviado exitosamente.' });
            }
        } else {
            res.status(500).json({ message: 'Error al enviar el mensaje.' });
        }
    } catch (error) {
        console.log(`Se produjo un error en el ingreso de leads manuales: ${error}`);
        res.status(500).json({ message: 'Error al procesar el ingreso manual.' });
    }
};

module.exports = manualCustomerEntry;