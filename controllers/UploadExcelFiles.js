const path = require('path');
const fs = require('fs');
const moment = require('moment');
const processExcelFile = require('../services/processExcelFile.js');
const insertDataFromJson = require('../utils/insertDataFromJson.js');
const deletedFile = require('../utils/deletedFiles.js');

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
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }

    const extname = path.extname(req.file.originalname).toLowerCase();

    if (extname !== '.xlsx' && extname !== '.xls') {
        return res.status(400).send('El archivo subido no es un archivo Excel válido. Solo se permiten archivos .xlsx y .xls.');
    }

    const basename = path.basename(req.file.originalname, extname);
    const newFileName = `${basename}_${moment().format('YYYYMMDD_HHmmss')}${extname}`;
    const newFilePath = path.join(__dirname, '../public', newFileName);

    fs.rename(req.file.path, newFilePath, async (err) => {
        if (err) {
            return res.status(500).send('Error al procesar el archivo Excel.');
        }

        try {
            const jsonFilePath = await processExcelFile(newFilePath);

            await insertDataFromJson(jsonFilePath);

            await deletedFile(jsonFilePath);

            res.json({
                message: 'Datos procesados e insertados exitosamente.',
                jsonFile: jsonFilePath
            });
        } catch (error) {
            res.status(500).send('Error al procesar el archivo Excel: ' + error.message);
        }
    });
};

module.exports = UploadExcelFiles;