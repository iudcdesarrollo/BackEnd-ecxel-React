const { Estado, Carrera, DatosPersonales } = require('../models/ModelDBWhatsappLedasCallCenter.js');
const { Op } = require('sequelize');

/**
 * The function `getConsultas` retrieves client data based on query parameters such as type, phone
 * number, and ID, handling different conditions and returning the results in a structured format.
 * @param req - `req` is the request object which contains information about the HTTP request such as
 * headers, parameters, body, etc. In this context, `req.query` is used to access the query parameters
 * sent in the request URL. The query parameters can be accessed as key-value pairs in the `req.query
 * @param res - The `res` parameter in the `getConsultas` function is the response object that will be
 * used to send the response back to the client making the request. It is typically used to send HTTP
 * responses with data or error messages. In the provided code snippet, you can see that the `res
 * @returns The `getConsultas` function is returning either a single client object or an array of
 * client objects based on the query parameters provided in the request. If the `id` query parameter is
 * provided, it will return a single client object matching that ID. If the `tipo` or `telefono` query
 * parameters are provided, it will return an array of client objects based on the filtering
 * conditions. The
 */
const getConsultas = async (req, res) => {
    try {
        const { tipo, telefono, id, fechaInicio, fechaFin } = req.query;

        console.log(`datos enviados por el cliente en consultas: ${tipo},${telefono},${id},${fechaInicio},${fechaFin}`);

        const whereConditions = {};

        const estadoIds = {
            'gestionado': '25d6fada-665b-11ef-856b-0aa110f8f49d',
            'no-gestionado': '3063e943-665b-11ef-856b-0aa110f8f49d',
            'interesado': '2b2f3f15-665b-11ef-856b-0aa110f8f49d'
        };

        if (id) {
            const client = await DatosPersonales.findOne({
                where: { id },
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
                ]
            });

            if (!client) {
                console.log('Cliente no encontrado');
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            const result = {
                ...client.toJSON(),
                estadoNombre: client.Estado ? client.Estado.nombre : 'Desconocido',
                carreraNombre: client.Carrera ? client.Carrera.nombre : 'Desconocido'
            };

            console.log(`esto es lo que se envia ccomo respuesta de consoluta: ${result}`);

            return res.json(result);
        }

        if (telefono) {
            const client = await DatosPersonales.findOne({
                where: { telefono },
                attributes: ['id']
            });

            if (!client) {
                console.log('Cliente no encontrado');
                return res.status(404).json({ message: 'Cliente inexistente' });
            }

            console.log(`esto es lo que se envia ccomo respuesta de consoluta: ${client.id}`);

            return res.json({ id: client.id });
        }

        if (tipo) {
            const estadoId = estadoIds[tipo];
            if (estadoId) {
                whereConditions.estado_id = estadoId;
            } else {
                console.log('Tipo de consulta no válido');
                return res.status(400).json({ message: 'Tipo de consulta no válido' });
            }
        }

        if (fechaInicio || fechaFin) {
            whereConditions.fecha_envio_wha = {
                [Op.gte]: fechaInicio ? new Date(fechaInicio) : '1900-01-01 00:00:00',
                [Op.lte]: fechaFin ? new Date(fechaFin) : new Date()
            };
        }

        const clients = await DatosPersonales.findAll({
            where: whereConditions,
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
            ]
        });

        const result = clients.map(client => ({
            ...client.toJSON(),
            estadoNombre: client.Estado ? client.Estado.nombre : 'Desconocido',
            carreraNombre: client.Carrera ? client.Carrera.nombre : 'Desconocido'
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = getConsultas;