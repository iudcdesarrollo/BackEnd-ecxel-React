const { Estado, Carrera, DatosPersonales, Servicio } = require('../models/ModelDBWhatsappLedasCallCenter.js');
const bannedNumbers = require('../resources/bannedNumbers.js'); // Numeros vetados de cualquier operacion...

/**
 * The function `getclients` is an asynchronous function in JavaScript that retrieves clients based on
 * a specified service name, with pagination and error handling included.
 * @param req - The `req` parameter in the `getclients` function stands for the request object, which
 * contains information about the HTTP request made to the server. This object includes details such as
 * the request headers, query parameters, body content, and more.
 * @param res - The `res` parameter in the `getclients` function is the response object that is used to
 * send a response back to the client making the request. It is typically used to send HTTP responses
 * with data or error messages. In the provided code snippet, the `res` parameter is used to send
 * @returns The function `getclients` is returning JSON data with the following structure:
 * - `total`: Total number of clients for the specified service.
 * - `page`: Current page number.
 * - `limit`: Number of clients per page.
 * - `data`: Array of client objects containing the following attributes:
 *   - `nombres`: First names of the client.
 *   - `apellidos`: Last names of
 */
const getclients = async (req, res) => {
  try {
    const nameService = req.query.nameService;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (!nameService) {
      return res.status(400).json({ message: 'El campo nameService es obligatorio' });
    }

    const service = await Servicio.findOne({
      where: { nombre: nameService }
    });

    if (!service) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    const totalClients = await DatosPersonales.count({
      where: { servicio_id: service.id }
    });

    let clients = await DatosPersonales.findAll({
      where: { servicio_id: service.id },
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

    clients = clients.filter(client => !bannedNumbers.includes(client.telefono));

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