const { DataTypes, Sequelize } = require('sequelize');

/**
 * Define el modelo User.
 * @param {Sequelize} sequelize - Instancia de Sequelize.
 * @returns {Model} - Modelo de Usuario.
 */

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      onUpdate: Sequelize.NOW,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  return User;
};