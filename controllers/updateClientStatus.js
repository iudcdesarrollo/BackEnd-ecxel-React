const { DatosPersonales, Estado } = require('../models/ModelDBWhatsappLedasCallCenter.js');

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

    console.log(`esto es lo que llega en la consulta de update estados: ${id},${estado}`);

    if (!id || !estado) {
        return res.status(400).json({ message: 'ID and estado are required' });
    }

    const validEstados = ['NO_GESTIONADO', 'GESTIONADO','INSCRITO','NO_INTERESADO','PRIORIDAD_BAJA','PRIORIDAD_MEDIA','PRIORIDAD_ALTA'];

    if (!validEstados.includes(estado)) {
        return res.status(400).json({ message: 'Invalid estado provided' });
    }

    try {
        const estadoRecord = await Estado.findOne({ where: { nombre: estado } });
        if (!estadoRecord) {
            return res.status(404).json({ message: 'Estado not found' });
        }

        const [updated] = await DatosPersonales.update(
            { estado_id: estadoRecord.id },
            { where: { id } }
        );

        if (updated) {
            console.log('Client status updated successfully');
            res.status(200).json({ message: 'Client status updated successfully' });
        } else {
            console.log('Client not found');
            res.status(404).json({ message: 'Client not found' });
        }
    } catch (error) {
        console.error('Error updating client status:', error);
        res.status(500).json({ message: 'Error updating client status' });
    }
};

module.exports = updateClientStatus;