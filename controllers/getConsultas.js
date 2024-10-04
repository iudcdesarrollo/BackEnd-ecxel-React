const { Estado, Carrera, Servicio, DatosPersonales } = require('../models/ModelDBWhatsappLedasCallCenter.js');
const { Op } = require('sequelize');

/**
 * The function `getConsultas` retrieves client data based on query parameters such as type, phone
 * number, and ID, handling different conditions and returning the results in a structured format.
 * This version includes optional pagination based on `page` and `limit` query parameters.
 * @param req - `req` is the request object containing HTTP request data, including query parameters.
 * @param res - The `res` parameter is the response object used to send the response back to the client.
 */
const getConsultas = async (req, res) => {
    try {
        const { tipo, telefono, id, fechaInicio, fechaFin, nameService, page = 1, limit = 10 } = req.query;

        console.log(`Datos enviados por el cliente en consultas: ${tipo}, ${telefono}, ${id}, ${fechaInicio}, ${fechaFin}, ${nameService}, page: ${page}, limit: ${limit}`);

        if (!nameService) {
            return res.status(400).json({ message: 'El nombre del servicio es obligatorio' });
        }

        const whereConditions = {};

        const servicio = await Servicio.findOne({
            where: { nombre: nameService }
        });

        if (!servicio) {
            console.log('Servicio no encontrado');
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        whereConditions.servicio_id = servicio.id;

        const estadoIds = {
            'gestionado': '5a158922-66e5-11ef-8b15-a2aa77fc013e',
            'no-gestionado': 'b3a2c5d5-4f7b-4e8d-89a7-9f3c0e2d6d60',
            'interesado': 'b3a2c5d4-4f7b-4e8d-89a7-9f3c0e2d6d59',
        };

        if (id) {
            const client = await DatosPersonales.findOne({
                where: { id, servicio_id: servicio.id },
                include: [
                    { model: Estado, attributes: ['nombre'] },
                    { model: Carrera, attributes: ['nombre'] }
                ],
                attributes: ['nombres', 'apellidos', 'correo', 'telefono', 'enviado', 'fecha_envio_wha']
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

            return res.json(result);
        }

        if (telefono) {
            console.log(`Buscando cliente con teléfono: ${telefono}`);
            const client = await DatosPersonales.findOne({
                where: { telefono, servicio_id: servicio.id },
                attributes: ['id']
            });
        
            if (!client) {
                console.log('Cliente no encontrado');
                return res.status(404).json({ message: 'Cliente inexistente' });
            }
        
            return res.json({ id: client.id });
        }
        

        if (tipo) {
            const estadoId = estadoIds[tipo];
            if (estadoId) {
                whereConditions.estado_id = estadoId;
            } else {
                return res.status(400).json({ message: 'Tipo de consulta no válido' });
            }
        }

        if (fechaInicio || fechaFin) {
            whereConditions.fecha_envio_wha = {
                [Op.gte]: fechaInicio ? new Date(fechaInicio) : '1900-01-01 00:00:00',
                [Op.lte]: fechaFin ? new Date(fechaFin) : new Date()
            };
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const clients = await DatosPersonales.findAndCountAll({
            where: whereConditions,
            include: [
                { model: Estado, attributes: ['nombre'] },
                { model: Carrera, attributes: ['nombre'] }
            ],
            attributes: ['nombres', 'apellidos', 'correo', 'telefono', 'enviado', 'fecha_envio_wha'],
            limit: parseInt(limit),
            offset: offset,
            order: [['fecha_envio_wha', 'DESC']]
        });

        const totalPages = Math.ceil(clients.count / limit);

        const result = clients.rows.map(client => ({
            ...client.toJSON(),
            estadoNombre: client.Estado ? client.Estado.nombre : 'Desconocido',
            carreraNombre: client.Carrera ? client.Carrera.nombre : 'Desconocido'
        }));

        res.json({
            total: clients.count,
            page: parseInt(page),
            totalPages: totalPages,
            limit: parseInt(limit),
            data: result
        });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = getConsultas;