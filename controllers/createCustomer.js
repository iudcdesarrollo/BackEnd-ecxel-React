const { DatosPersonales, Carrera, Estado, Servicio } = require('../models/ModelDBWhatsappLedasCallCenter');
const { v4: uuidv4 } = require('uuid');

/**
 * The function `createCustomer` is an asynchronous function that creates a new customer record with
 * default values if the customer does not already exist based on the provided phone number, and
 * updates the existing customer's WhatsApp send date if found.
 * @param req - The `req` parameter in the `createCustomer` function stands for the request object. It
 * contains information about the HTTP request that triggered the function, including headers, body,
 * parameters, and more. In this case, the function is expecting a phone number (`telefono`) to be
 * present in the request
 * @param res - The `res` parameter in the `createCustomer` function is the response object that will
 * be used to send a response back to the client making the request. It is typically used to send HTTP
 * responses with status codes, headers, and data back to the client. In the provided code snippet, `
 * @returns The function `createCustomer` is returning either a success response with the customer ID
 * (status code 200 or 201) if a new customer is created or an existing customer is updated, or an
 * error response (status code 400 or 500) if there are validation errors or an internal server error
 * occurs.
 */

const createCustomer = async (req, res) => {
    try {
        const { telefono } = req.body;

        if (!telefono) {
            return res.status(400).json({ message: 'El número de teléfono es requerido' });
        }

        let carrera = await Carrera.findOne({ where: { nombre: 'CARRERA NO IDENTIFICADA' } });
        if (!carrera) {
            carrera = await Carrera.create({
                id: uuidv4(),
                nombre: 'CARRERA NO IDENTIFICADA'
            });
            console.log('Carrera creada:', carrera.id);
        }

        let estado = await Estado.findOne({ where: { nombre: 'SIN GESTIONAR' } });
        if (!estado) {
            estado = await Estado.create({
                id: uuidv4(),
                nombre: 'SIN GESTIONAR'
            });
            console.log('Estado creado:', estado.id);
        }

        let servicio = await Servicio.findOne({ where: { nombre: 'SERVICIO NO IDENTIFICADO' } });
        if (!servicio) {
            servicio = await Servicio.create({
                id: uuidv4(),
                nombre: 'SERVICIO NO IDENTIFICADO'
            });
            console.log('Servicio creado:', servicio.id);
        }

        const defaultValues = {
            id: uuidv4(),
            nombres: 'Nombre predeterminado',
            apellidos: 'Apellido predeterminado',
            correo: 'correo@predeterminado.com',
            telefono: telefono,
            carrera_id: carrera.id,
            estado_id: estado.id,
            servicio_id: servicio.id,
            enviado: false,
            fecha_envio_wha: new Date(),
            fecha_ingreso_meta: null,
        };

        let existingCustomer = await DatosPersonales.findOne({ where: { telefono: telefono } });

        if (existingCustomer) {
            if (!existingCustomer.fecha_envio_wha) {
                existingCustomer.fecha_envio_wha = new Date();
                await existingCustomer.save();
                console.log('Cliente existente actualizado:', existingCustomer.id);
            } else {
                console.log('La fecha de WhatsApp ya estaba establecida, no se actualizó.');
            }
            return res.status(200).json({ id: existingCustomer.id });
        }

        const newCustomer = await DatosPersonales.create(defaultValues);

        console.log('Nuevo cliente creado:', newCustomer.id);
        res.status(201).json({ id: newCustomer.id });
    } catch (error) {
        console.error('Error al crear o verificar el cliente:', error);
        res.status(500).json({ message: 'Error al crear o verificar el cliente' });
    }
};

module.exports = createCustomer;