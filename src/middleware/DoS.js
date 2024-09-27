const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const preventionOfDenialOfService = (app) => {
    app.set('trust proxy', 1);

    app.use(helmet());

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
        message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.'
    });

    app.use(limiter);
};

module.exports = preventionOfDenialOfService;