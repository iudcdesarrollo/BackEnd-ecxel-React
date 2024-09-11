const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DatosPersonales = sequelize.define('DatosPersonales', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    fecha_ingreso_meta: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
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
        model: 'Carrera',
        key: 'id',
      },
    },
    estado_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Estado',
        key: 'id',
      },
    },
    servicio_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Servicio',
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

  return DatosPersonales;
};