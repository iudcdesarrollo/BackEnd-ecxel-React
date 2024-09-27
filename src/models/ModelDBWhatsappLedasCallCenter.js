const createSequelizeInstance = require('../config/database.js');

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;
const DB_HOST = process.env.DB_HOST;

const sequelize = createSequelizeInstance(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT);

const Estado = require('./estado')(sequelize);
const Carrera = require('./carrera')(sequelize);
const Servicio = require('./servicio')(sequelize);
const DatosPersonales = require('./datosPersonales')(sequelize);

DatosPersonales.belongsTo(Carrera, { foreignKey: 'carrera_id' });
DatosPersonales.belongsTo(Estado, { foreignKey: 'estado_id' });
DatosPersonales.belongsTo(Servicio, { foreignKey: 'servicio_id' });

Carrera.hasMany(DatosPersonales, { foreignKey: 'carrera_id' });
Estado.hasMany(DatosPersonales, { foreignKey: 'estado_id' });
Servicio.hasMany(DatosPersonales, { foreignKey: 'servicio_id' });

module.exports = {
  Estado,
  Carrera,
  Servicio,
  DatosPersonales,
};