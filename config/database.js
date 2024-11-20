const { Sequelize } = require('sequelize');

/**
 * Crea una instancia de Sequelize con las variables de entorno proporcionadas.
 * @param {string} dbName - Nombre de la base de datos.
 * @param {string} dbUser - Usuario de la base de datos.
 * @param {string} dbPassword - Contraseña de la base de datos.
 * @param {string} dbHost - Host de la base de datos.
 * @param {number} dbPort - Puerto de la base de datos.
 * @returns {Promise<Sequelize>} - Promesa que se resuelve con la instancia de Sequelize configurada.
 */
const createSequelizeInstance = (dbName, dbUser, dbPassword, dbHost, dbPort) => {
    const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        port: dbPort,
        dialect: 'mysql',
        logging: false,
    });

    try {
        sequelize.authenticate();
        console.log('Se logró hacer la conexión con la base de datos...');
        return sequelize;
    } catch (error) {
        console.error(`Ocurrió un error con la conexión a la base de datos: ${error.message}`);
        throw error;
    }
};

module.exports = createSequelizeInstance;