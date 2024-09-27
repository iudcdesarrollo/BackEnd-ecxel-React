const { Estado, Carrera, DatosPersonales } = require('../models/ModelDBWhatsappLedasCallCenter.js');

/**
 * The function `deleteAllData` deletes all records from three different tables and sends a response
 * indicating success or failure.
 * @param req - The `req` parameter typically represents the HTTP request that is being made to the
 * server. It contains information about the request such as the headers, body, parameters, and more.
 * In this context, it is likely an Express.js request object that is used to handle incoming requests
 * in a Node.js application
 * @param res - The `res` parameter in the `deleteAllData` function is typically the response object in
 * Node.js Express framework. It is used to send a response back to the client making the request. In
 * this case, it is being used to send a JSON response with a message indicating that all data has
 */
const deleteAllData = async (req, res) => {
    try {
        await DatosPersonales.destroy({ where: {} });
        await Carrera.destroy({ where: {} });

        console.log('Todos los datos han sido eliminados exitosamente.');
        res.json({
            message: 'Todos los datos han sido eliminados exitosamente.'
        });
    } catch (error) {
        console.error('Error al eliminar los datos:', error);
        res.status(500).send('Error al eliminar los datos.');
    }
};

module.exports = deleteAllData;