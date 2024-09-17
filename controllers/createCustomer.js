const { DatosPersonales, Carrera, Estado, Servicio } = require('../models/ModelDBWhatsappLedasCallCenter');
const { v4: uuidv4 } = require('uuid');

/**
 * La función `createCustomer` crea un nuevo registro de cliente si no existe basándose en el número de teléfono y el nombre del servicio proporcionados.
 * Si ya existe un cliente con el mismo número de teléfono, actualiza la fecha de envío de WhatsApp si no está establecida.
 * 
 * @param req - Objeto de solicitud que contiene el número de teléfono (`telefono`) y el nombre del servicio (`nameService`) en el cuerpo de la solicitud.
 * @param res - Objeto de respuesta que se utiliza para enviar una respuesta de vuelta al cliente.
 * 
 * @returns Un ID de cliente si se creó o actualizó, o un mensaje de error si ocurrió algún problema.
 */
const createCustomer = async (req, res) => {
    try {
        const { telefono, nameService } = req.body;

        if (!telefono || !nameService) {
            return res.status(400).json({ message: 'El número de teléfono y el nombre del servicio son requeridos' });
        }

        let carrera = await Carrera.findOne({ where: { nombre: 'CARRERA NO IDENTIFICADA' } });
        if (!carrera) {
            carrera = await Carrera.create({
                id: uuidv4(),
                nombre: 'CARRERA NO IDENTIFICADA'
            });
            console.log('Carrera creada:', carrera.id);
        }

        let estado = await Estado.findOne({ where: { nombre: 'NO_GESTIONADO' } });
        if (!estado) {
            estado = await Estado.create({
                id: uuidv4(),
                nombre: 'NO_GESTIONADO'
            });
            console.log('Estado creado:', estado.id);
        }

        let servicio = await Servicio.findOne({ where: { nombre: nameService } });
        if (!servicio) {
            servicio = await Servicio.create({
                id: uuidv4(),
                nombre: nameService
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

        // Comprobar si el cliente ya existe basado en el número de teléfono
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

        // Crear un nuevo cliente si no existe
        const newCustomer = await DatosPersonales.create(defaultValues);

        console.log('Nuevo cliente creado:', newCustomer.id);
        res.status(201).json({ id: newCustomer.id });
    } catch (error) {
        console.error('Error al crear o verificar el cliente:', error);
        res.status(500).json({ message: 'Error al crear o verificar el cliente' });
    }
};

module.exports = createCustomer;