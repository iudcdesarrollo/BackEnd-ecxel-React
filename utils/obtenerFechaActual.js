const moment = require('moment');

const obtenerFechaActual = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};

// Prueba la función aquí
console.log(obtenerFechaActual());

module.exports = obtenerFechaActual;