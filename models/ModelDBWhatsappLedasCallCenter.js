const { Sequelize, DataTypes } = require('sequelize');
const createSequelizeInstance = require('../config/database.js');
const { v4: uuidv4 } = require('uuid');

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;
const DB_HOST = process.env.DB_HOST;

const sequelize = createSequelizeInstance(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT);

const Estado = sequelize.define('Estado', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'estados',
  timestamps: false,
});

const Carrera = sequelize.define('Carrera', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'carreras',
  timestamps: false,
});

const DatosPersonales = sequelize.define('DatosPersonales', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  fecha_ingreso_meta: {
    type: DataTypes.DATE,
    allowNull: true, // Permitir null
    defaultValue: null, // Valor por defecto null
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carrera_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Carrera,
      key: 'id',
    },
  },
  estado_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Estado,
      key: 'id',
    },
  },
  enviado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  fecha_envio_wha: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'datos_personales',
  timestamps: false,
});

DatosPersonales.belongsTo(Carrera, { foreignKey: 'carrera_id' });
DatosPersonales.belongsTo(Estado, { foreignKey: 'estado_id' });

Carrera.hasMany(DatosPersonales, { foreignKey: 'carrera_id' });
Estado.hasMany(DatosPersonales, { foreignKey: 'estado_id' });

module.exports = {
  Estado,
  Carrera,
  DatosPersonales,
};