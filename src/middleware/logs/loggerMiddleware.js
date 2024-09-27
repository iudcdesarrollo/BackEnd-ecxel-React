const logToFile = require("../../utils/logger");

const loggerMiddleware = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const { method, url } = req;
        const { statusCode } = res;
        const duration = Date.now() - startTime;

        const logMessage = `[${new Date().toISOString()}] ${method} ${url} ${statusCode} - ${duration}ms`;

        // Determinar si la solicitud fue exitosa o no
        const isError = statusCode >= 400; // Considerar 4xx y 5xx como errores

        // Guardar en el archivo de éxito o error
        logToFile(logMessage, isError);
    });

    next();
};

module.exports = loggerMiddleware;