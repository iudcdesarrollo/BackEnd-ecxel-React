const moment = require('moment');

const obtenerFechaActual = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};

module.exports = obtenerFechaActual;