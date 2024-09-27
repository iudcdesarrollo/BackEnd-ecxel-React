const { DatosPersonales, Carrera } = require('../models/ModelDBWhatsappLedasCallCenter');
const { v4: uuidv4 } = require('uuid');
const logToFile = require('../utils/logger.js');

/**
 * The function `updateClient` updates the client's information based on the provided ID,
 * handling validation and error cases.
 * @param req - The `req` parameter represents the HTTP request containing the client's data.
 * @param res - The `res` parameter is the response object that will be sent back to the client.
 * @returns JSON response indicating the status of the update operation.
 */
const updateClient = async (req, res) => {
    const { id, nombres, apellidos, correo, carrera } = req.body;
    const startTime = Date.now();

    let clientStatus = {
        id: id,
        errores: []
    };

    console.log(`Esto es lo que llega en la consulta para actualizar el cliente: ${id}, ${nombres}, ${apellidos}, ${correo}, ${carrera}`);

    if (!id) {
        clientStatus.errores.push('El ID del cliente es requerido');
        console.log('Errores:', clientStatus.errores);
        return res.status(400).json({ message: 'El ID del cliente es requerido' });
    }

    try {
        let cliente = await DatosPersonales.findOne({ where: { id: id } });

        if (!cliente) {
            clientStatus.errores.push('Cliente no encontrado');
            console.log('Errores:', clientStatus.errores);
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        let carreraEncontrada = await Carrera.findOne({ where: { nombre: carrera } });
        
        if (!carreraEncontrada) {
            // Solo crear la carrera si no existe
            carreraEncontrada = await Carrera.create({
                id: uuidv4(),
                nombre: carrera
            });
            console.log('Carrera creada:', carreraEncontrada.id);
        } else {
            console.log('Carrera existente encontrada:', carreraEncontrada.id);
        }

        // Actualizar la información del cliente
        cliente.nombres = nombres || cliente.nombres;
        cliente.apellidos = apellidos || cliente.apellidos;
        cliente.correo = correo || cliente.correo;
        cliente.carrera_id = carreraEncontrada.id;

        await cliente.save();
        console.log('Cliente actualizado con éxito');

        return res.status(200).json({ message: 'Cliente actualizado con éxito', cliente });
    } catch (error) {
        clientStatus.errores.push('Error al actualizar el cliente: ' + error.message);
        console.error('Error al actualizar el cliente:', error);
        console.log('Errores:', clientStatus.errores);
        return res.status(500).json({ message: 'Error al actualizar el cliente' });
    } finally {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusCode = res.statusCode;
        const method = req.method;
        const url = req.originalUrl;

        if (clientStatus.errores.length > 0) {
            let messageLog = `${new Date().toISOString()} - [${new Date().toISOString()}] ${method} ${url} ${statusCode} - ${duration}ms\n
            Actualización de cliente,
            id: ${id},
            errores: ${clientStatus.errores.length > 0 ? clientStatus.errores.join(', ') : 'Ninguno'}
        `;
            logToFile(messageLog, true);
        } else {
            let messageLog = `${new Date().toISOString()} - [${new Date().toISOString()}] ${method} ${url} ${statusCode} - ${duration}ms\n
            Actualización de cliente,
            id: ${id},
            mensaje: Cliente actualizado con éxito
        `;
            logToFile(messageLog, false);
        }
    }
};

module.exports = updateClient;