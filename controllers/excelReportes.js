const { Estado, Carrera, DatosPersonales, Servicio } = require('../models/ModelDBWhatsappLedasCallCenter.js');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');

/**
 * La función excelReports genera un reporte en Excel basado en los parámetros de consulta especificados
 * y lo envía como un archivo descargable en la respuesta.
 * @param req - `req` es el objeto de solicitud que contiene información sobre la solicitud HTTP realizada por
 * el cliente al servidor. Incluye datos como encabezados de solicitud, parámetros de consulta, contenido del cuerpo,
 * y más. En el fragmento de código proporcionado, `req` se usa para extraer parámetros de consulta como `startDate`,
 * `endDate`, `telefono`, `servicioID` y `servicioNombre`.
 * @param res - El parámetro `res` en la función `excelReports` es el objeto de respuesta en
 * Express.js. Se utiliza para enviar una respuesta de vuelta al cliente que realiza la solicitud. En esta función,
 * el objeto de respuesta se usa para enviar el archivo Excel generado como un archivo adjunto descargable
 * (`ReporteClientes.xlsx`).
 * @returns La función `excelReports` devuelve un archivo de hoja de cálculo de Excel que contiene datos basados en
 * los parámetros de consulta `startDate`, `endDate`, `telefono`, `servicioID` y `servicioNombre` de la solicitud. La función
 * primero verifica si se proporcionan `startDate` y `endDate`, y si no, devuelve un estado 400 con un mensaje
 * indicando que se requieren ambas fechas.
 */
const excelReports = async (req, res) => {
    try {
        let { startDate, endDate, telefono, servicioNombre } = req.query;

        console.log(`esto es lo que se manda por la query para asi mismo ver: ${startDate}, ${endDate}, ${telefono}, ${servicioNombre}`)

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Por favor, proporciona ambas fechas: startDate y endDate.' });
        }

        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        endDateTime.setUTCHours(23, 59, 59, 999);

        const whereConditions = {
            fecha_envio_wha: {
                [Op.between]: [startDateTime, endDateTime],
            },
        };

        if (telefono) {
            whereConditions.telefono = telefono;
        }

        if (servicioNombre) {
            const servicio = await Servicio.findOne({ where: { nombre: servicioNombre } });
            if (servicio) {
                whereConditions.servicio_id = servicio.id;
            } else {
                return res.status(400).json({ message: 'Nombre de servicio no encontrado.' });
            }
        }

        const clients = await DatosPersonales.findAll({
            where: whereConditions,
            include: [
                {
                    model: Estado,
                    attributes: ['nombre'],
                },
                {
                    model: Carrera,
                    attributes: ['nombre'],
                },
                {
                    model: Servicio,
                    attributes: ['nombre'],
                }
            ],
            attributes: [
                'nombres',
                'apellidos',
                'correo',
                'telefono',
                'enviado',
                'fecha_envio_wha',
                'fecha_ingreso_meta'
            ],
        });

        const gestionadoClients = clients.filter(client => client.Estado && client.Estado.nombre.toLowerCase() === 'gestionado');
        const sinGestionarClients = clients.filter(client => client.Estado && client.Estado.nombre.toLowerCase() === 'sin gestionar');
        const interesadosClients = clients.filter(client => client.Estado && client.Estado.nombre.toLowerCase() === 'interesado');

        const workbook = new ExcelJS.Workbook();

        const addSheetWithData = (sheetName, data) => {
            const sheet = workbook.addWorksheet(sheetName);
            sheet.columns = [
                { header: 'Nombres', key: 'nombres', width: 30 },
                { header: 'Apellidos', key: 'apellidos', width: 30 },
                { header: 'Correo', key: 'correo', width: 30 },
                { header: 'Teléfono', key: 'telefono', width: 15 },
                { header: 'Enviado', key: 'enviado', width: 10 },
                { header: 'Fecha Envio WhatsApp', key: 'fecha_envio_wha', width: 20 },
                { header: 'Fecha Ingreso Meta', key: 'fecha_ingreso_meta', width: 20 },
                { header: 'Estado', key: 'estado', width: 20 },
                { header: 'Carrera', key: 'carrera', width: 20 },
                { header: 'Servicio', key: 'servicio', width: 20 },
            ];

            data.forEach(client => {
                const fechaEnvioWha = client.fecha_envio_wha ? new Date(client.fecha_envio_wha).toISOString().slice(0, 10) : 'No disponible';
                const fechaIngresoMeta = client.fecha_ingreso_meta ? new Date(client.fecha_ingreso_meta).toISOString().slice(0, 10) : 'No disponible';
                sheet.addRow({
                    nombres: client.nombres,
                    apellidos: client.apellidos,
                    correo: client.correo,
                    telefono: client.telefono,
                    enviado: client.enviado ? 'Sí' : 'No',
                    fecha_envio_wha: fechaEnvioWha,
                    fecha_ingreso_meta: fechaIngresoMeta,
                    estado: client.Estado.nombre,
                    carrera: client.Carrera.nombre,
                    servicio: client.Servicio.nombre,
                });
            });
        };

        addSheetWithData('Gestionado', gestionadoClients);
        addSheetWithData('Sin Gestionar', sinGestionarClients);
        addSheetWithData('Interesados', interesadosClients);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=ReporteClientes.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al generar el reporte:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = excelReports;