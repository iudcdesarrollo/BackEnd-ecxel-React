const { Estado, Carrera, DatosPersonales, Servicio } = require('../models/ModelDBWhatsappLedasCallCenter.js');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');

/**
 * The excelReports function generates an Excel report based on specified query parameters and sends it
 * as a downloadable file in response.
 * @param req - `req` is the request object which contains information about the HTTP request made by
 * the client to the server. It includes data such as request headers, query parameters, body content,
 * and more. In the provided code snippet, `req` is used to extract query parameters like `startDate`,
 * `endDate`, `telefono`, and `servicioID`.
 * @param res - The `res` parameter in the `excelReports` function is the response object in
 * Express.js. It is used to send a response back to the client making the request. In this function,
 * the response object is used to send the generated Excel file as a downloadable attachment
 * (`ReporteClientes.xlsx`).
 * @returns The `excelReports` function returns an Excel spreadsheet file containing data based on
 * the query parameters `startDate`, `endDate`, `telefono`, and `servicioID` from the request. The function
 * first checks if `startDate` and `endDate` are provided, and if not, it returns a 400 status with a
 * message indicating that both dates are required.
 */
const excelReports = async (req, res) => {
    try {
        let { startDate, endDate, telefono, servicioID } = req.query;

        //console.log(`Fecha de inicio de la solicitud: ${startDate}, Fecha fin de la solicitud: ${endDate}`);

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

        if (servicioID) {
            whereConditions.servicio_id = servicioID;
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