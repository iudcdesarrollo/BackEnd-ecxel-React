const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserRole = sequelize.define('UserRole', {
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.UUID,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
  }, {
    tableName: 'user_roles',
    timestamps: false,
  });

  return UserRole;
};