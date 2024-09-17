const { Estado, Carrera, DatosPersonales, Servicio } = require('../models/ModelDBWhatsappLedasCallCenter.js');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const bannedNumbers = require('../resources/bannedNumbers.js');

/**
 * The excelReports function generates an Excel report based on specified query parameters, filtering
 * out banned phone numbers and categorizing clients based on their status.
 * @param req - The function `excelReports` is an asynchronous function that generates an Excel report
 * based on the provided request parameters. Here's a breakdown of the function:
 * @param res - The `res` parameter in the `excelReports` function is the response object in
 * Express.js. It is used to send a response back to the client making the request. In this function,
 * the response object is used to send JSON responses in case of errors or to send the Excel file as a
 * @returns The `excelReports` function is returning an Excel file containing three sheets:
 * "GESTIONADOS", "NO_GESTIONADOS", and "INSCRITOS". Each sheet contains data of clients filtered based
 * on certain conditions, such as excluding clients with banned phone numbers and categorizing clients
 * based on their status (gestionado, no_gestionado, inscrito). The Excel file is
 */
const excelReports = async (req, res) => {
    try {
        let { startDate, endDate, telefono, servicioNombre } = req.query;

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

        let clients = await DatosPersonales.findAll({
            where: whereConditions,
            include: [
                { model: Estado, attributes: ['nombre'] },
                { model: Carrera, attributes: ['nombre'] },
                { model: Servicio, attributes: ['nombre'] }
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

        clients = clients.filter(client => !bannedNumbers.includes(client.telefono));

        const gestionadoClients = clients.filter(client => {
            const estado = client.Estado && client.Estado.nombre.toLowerCase();
            return ['gestionado', 'prioridad_baja', 'prioridad_media', 'prioridad_alta'].includes(estado);
        });
        const sinGestionarClients = clients.filter(client => client.Estado && client.Estado.nombre.toLowerCase() === 'no_gestionado');
        const interesadosClients = clients.filter(client => client.Estado && client.Estado.nombre.toLowerCase() === 'inscrito');

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

        addSheetWithData('GESTIONADOS', gestionadoClients);
        addSheetWithData('NO_GESTIONADOS', sinGestionarClients);
        addSheetWithData('INSCRITOS', interesadosClients);

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