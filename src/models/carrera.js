const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
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

    return Carrera;
};