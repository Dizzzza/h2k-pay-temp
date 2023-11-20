module.exports = (sequelize, DataTypes) =>
    sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        uuid: DataTypes.STRING
    });