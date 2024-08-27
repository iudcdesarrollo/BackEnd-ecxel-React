const { Estado, Carrera, DatosPersonales } = require('../models/ModelDBWhatsappLedasCallCenter.js');

/**
 * The function `getclients` retrieves a list of clients with pagination and specific attributes from a
 * database and returns the data in JSON format.
 * @param req - The `req` parameter in the `getclients` function is typically an object representing
 * the HTTP request. It contains information about the request made by the client, such as the request
 * headers, query parameters, body content, and more. In this specific function, `req.query.page` and
 * `req
 * @param res - The `res` parameter in the `getclients` function is the response object that will be
 * used to send a response back to the client making the request. It is typically used to send data,
 * status codes, and other information back to the client. In the provided code snippet, the `res
 */
const getclients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalClients = await DatosPersonales.count();
    
    const clients = await DatosPersonales.findAll({
      include: [
        {
          model: Estado,
          attributes: ['nombre']
        },
        {
          model: Carrera,
          attributes: ['nombre']
        }
      ],
      attributes: [
        'nombres',
        'apellidos',
        'correo',
        'telefono',
        'enviado',
        'fecha_envio_wha'
      ],
      limit: limit,
      offset: offset,
      order: [['fecha_envio_wha', 'DESC']]
    });

    res.json({
      total: totalClients,
      page: page,
      limit: limit,
      data: clients
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = getclients;