const { DatosPersonales, Estado } = require('../models/ModelDBWhatsappLedasCallCenter.js');
const logToFile = require('../utils/logger.js');

/**
 * The function `updateClientStatus` updates the status of a client based on the provided ID and
 * estado, handling validation and error cases.
 * @param req - The `req` parameter in the `updateClientStatus` function is typically an object
 * representing the HTTP request. It contains information about the request made to the server, such as
 * the request headers, body, parameters, and more. In this specific function, `req.body` is being used
 * to extract
 * @param res - The `res` parameter in the `updateClientStatus` function is the response object that
 * will be sent back to the client making the request. It is used to send HTTP responses back to the
 * client, such as status codes, JSON data, and error messages.
 * @returns The `updateClientStatus` function is returning different responses based on the conditions
 * met during its execution. Here are the possible return scenarios:
 */
const updateClientStatus = async (req, res) => {
    const { id, estado } = req.body;

    const startTime = Date.now();

    console.log(`esto es lo que llega en la consulta de update estados: ${id},${estado}`);

    let clientStatus = {
        id: id,
        estado: estado,
        errores: []
    };

    if (!id || !estado) {
        clientStatus.errores.push('ID and estado are required');
        console.log('Errores:', clientStatus.errores);
        return res.status(400).json({ message: 'ID and estado are required' });
    }

    const validEstados = [
        'NO_GESTIONADO', 'GESTIONADO', 'INSCRITO', 'NO_INTERESADO',
        'PRIORIDAD_BAJA', 'PRIORIDAD_MEDIA', 'PRIORIDAD_ALTA',
        'INTERESADO', 'MENSAJE_ACEPTADO', 'MENSAJE_ENVIADO', 'MENSAJE_RECHAZADO'
    ];

    if (!validEstados.includes(estado)) {
        clientStatus.errores.push('Invalid estado provided');
        console.log('Errores:', clientStatus.errores);
        return res.status(400).json({ message: 'Invalid estado provided' });
    }

    try {
        const estadoRecord = await Estado.findOne({ where: { nombre: estado } });
        if (!estadoRecord) {
            clientStatus.errores.push('Estado not found');
            console.log('Errores:', clientStatus.errores);
            return res.status(404).json({ message: 'Estado not found' });
        }

        const cliente = await DatosPersonales.findOne({ where: { id } });
        if (!cliente) {
            clientStatus.errores.push('Client not found');
            console.log('Errores:', clientStatus.errores);
            return res.status(404).json({ message: 'Client not found' });
        }

        if (cliente.estado_id === estadoRecord.id) {
            return res.status(202).json({ message: `El cliente con ID ${id} ya tiene el estado ${estado}` });
        }

        await DatosPersonales.update(
            { estado_id: estadoRecord.id },
            { where: { id } }
        );

        console.log('Client status updated successfully');
        res.status(200).json({ message: 'Client status updated successfully' });
    } catch (error) {
        clientStatus.errores.push('Error updating client status: ' + error.message);
        console.error('Error updating client status:', error);
        console.log('Errores:', clientStatus.errores);
        res.status(500).json({ message: 'Error updating client status' });
    }
    finally {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusCode = res.statusCode;
        const method = req.method;
        const url = req.originalUrl;
        if (clientStatus.errores.length > 0) {
            let messageLog = `${new Date().toISOString()} - [${new Date().toISOString()}] ${method} ${url} ${statusCode} - ${duration}ms\n
            Cambio de estados,
            id: ${id},
            estado: ${estado},
            Erro: ${clientStatus.errores.length > 0 ? clientStatus.errores.join(', ') : 'Ninguno'}
        `;
            logToFile(messageLog, true);
        }
        else {
            let messageLog = `${new Date().toISOString()} - [${new Date().toISOString()}] ${method} ${url} ${statusCode} - ${duration}ms\n
            Cambio de estados,
            id: ${id},
            estado: ${estado}
            mensage: Client status updated successfully
        `
            logToFile(messageLog, false);
        }
    }
};

module.exports = updateClientStatus;