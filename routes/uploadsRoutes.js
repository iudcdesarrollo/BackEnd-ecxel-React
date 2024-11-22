/* This code snippet is setting up a router in a Node.js application using the Express framework.
Here's a breakdown of what each part is doing: */
const express = require('express');
const multer = require('multer');
const router = express.Router();
const UploadExcelFiles = require('../controllers/UploadExcelFiles');
const deleteAllData = require('../controllers/deletedDB.js');
const manualCustomerEntry = require('../controllers/clientsManually.js');
const updateClientStatus = require('../controllers/updateClientStatus.js');
const validateManualCustomerEntry = require('../middleware/validationManual.js');
const blockFileTypes = require('../middleware/BlockFiles.js');
const getclients = require('../controllers/getClients.js');
const getConsultas = require('../controllers/getConsultas.js');
const excelReports = require('../controllers/excelReportes.js');
const createCustomer = require('../controllers/createCustomer.js');
const updateClient = require('../controllers/updateClient.js');
const getPersonsStatusCounts = require('../controllers/dataMetrics.js');

const upload = multer({ dest: 'public/' }); // carpeta en donde se almacenan los archivos entrantes de peticiones...

router.post('/upload/ExcelLedas', upload.single('file'),blockFileTypes,UploadExcelFiles);// enpoint para ingresar leads por medio de excel...
router.get('/upload/deleted', deleteAllData);// enpoint para borrar toda la base de datos...
router.post('/upload/manually',validateManualCustomerEntry,manualCustomerEntry);// enpoint para ingresar leads manualmente uno por uno...
router.post('/upload/estado',updateClientStatus); // enpoint para cambiar el estado del cliente en la base de datos...
router.get('/get/clientes',getclients);// enpoint para traer los datos personales de los clientes...
router.get('/get/consultas',getConsultas); // enpoint para hacer consultas segun el estado de mis clientes o por su numero de telefono...
router.get('/get/ReportsEcel',excelReports);// enpoint para crear el aexcel con el rango de fecha especifico...
router.post('/createCustomer',createCustomer);// enpoint para crear un nuevo cliente en la base de datos...
router.post('/update/clients', updateClient);// enpoint para actualizar los datos de un cliente en la base de datos...
router.get('/personas/Conteo',getPersonsStatusCounts)// enpoint para los datos de la gestion de los leads...

module.exports = router;