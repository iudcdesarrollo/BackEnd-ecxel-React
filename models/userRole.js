const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserRole = sequelize.define('UserRole', {
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id',
      },
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Role',
        key: 'id',
      },
      primaryKey: true,
    },
  }, {
    tableName: 'user_roles',
    timestamps: false,
  });

  return UserRole;
};