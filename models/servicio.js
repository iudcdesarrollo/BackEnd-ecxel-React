const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const Servicio = sequelize.define('Servicio', {
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
    tableName: 'servicios',
    timestamps: false,
  });

  return Servicio;
};