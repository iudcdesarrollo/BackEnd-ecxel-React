const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
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

    return Estado;
};