const path = require('path');
const fs = require('fs');
const moment = require('moment');
const processExcelFile = require('../services/processExcelFile.js');
const insertDataFromJson = require('../utils/insertDataFromJson.js');
const deletedFile = require('../utils/deletedFiles.js');
const logToFile = require('../utils/logger.js');  // Importamos el logger

/**
 * La función `UploadExcelFiles` maneja la carga, procesamiento e inserción de datos desde un
 * archivo de Excel en una aplicación Node.js.
 * @param req - `req` es el objeto de solicitud que representa la solicitud HTTP realizada por el cliente al
 * servidor. Contiene información sobre la solicitud, como encabezados, parámetros, cuerpo y archivos
 * subidos a través de la solicitud. En el fragmento de código proporcionado, `req` se usa para acceder al
 * archivo subido para su procesamiento.
 * @param res - El parámetro `res` en la función `UploadExcelFiles` es el objeto de respuesta que se utilizará para
 * enviar respuestas al cliente que realiza la solicitud. Se utiliza típicamente para enviar respuestas HTTP
 * con datos o mensajes de error. En el fragmento de código proporcionado, `res` se usa para enviar diferentes
 * respuestas.
 * @returns La función `UploadExcelFiles` devuelve diferentes respuestas basadas en ciertas
 * condiciones.
 */
const UploadExcelFiles = async (req, res) => {
    
    const nameServicio = req.body.nameServicio;

    const startTime = Date.now(); // Inicio del temporizador

    if (!req.file) {
        const errorMessage = 'No se ha subido ningún archivo.';
        console.log(errorMessage);
        logToFile(`${new Date().toISOString()} - [${req.method} ${req.originalUrl}] - ${errorMessage}`, true);
        return res.status(400).send(errorMessage);
    }

    const extname = path.extname(req.file.originalname).toLowerCase();

    if (extname !== '.xlsx' && extname !== '.xls') {
        const errorMessage = 'El archivo subido no es un archivo Excel válido. Solo se permiten archivos .xlsx y .xls.';
        console.log(errorMessage);
        logToFile(`${new Date().toISOString()} - [${req.method} ${req.originalUrl}] - ${errorMessage}`, true);
        return res.status(400).send(errorMessage);
    }

    const basename = path.basename(req.file.originalname, extname);
    const newFileName = `${basename}_${moment().format('YYYYMMDD_HHmmss')}${extname}`;
    const newFilePath = path.join(__dirname, '../public', newFileName);

    fs.rename(req.file.path, newFilePath, async (err) => {
        if (err) {
            const errorMessage = 'Error al procesar el archivo Excel.';
            console.error(errorMessage, err);
            logToFile(`${new Date().toISOString()} - [${req.method} ${req.originalUrl}] - ${errorMessage}`, true);
            return res.status(500).send(errorMessage);
        }

        try {
            const jsonFilePath = await processExcelFile(newFilePath, nameServicio);

            // await insertDataFromJson(jsonFilePath); // Descomentar si es necesario

            await deletedFile(jsonFilePath);

            const successMessage = 'Datos procesados e insertados exitosamente.';
            console.log(successMessage);
            const endTime = Date.now();
            const duration = endTime - startTime;

            // Log de éxito
            logToFile(`${new Date().toISOString()} - [${req.method} ${req.originalUrl}] - ${successMessage} - Duration: ${duration}ms`, false);
            res.json({
                message: successMessage,
                jsonFile: jsonFilePath
            });
        } catch (error) {
            const errorMessage = 'Error al procesar el archivo Excel: ' + error.message;
            console.error(errorMessage);
            logToFile(`${new Date().toISOString()} - [${req.method} ${req.originalUrl}] - ${errorMessage}`, true);
            res.status(500).send(errorMessage);
        }
    });
};

module.exports = UploadExcelFiles;