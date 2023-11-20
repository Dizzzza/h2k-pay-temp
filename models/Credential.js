module.exports = (sequelize, DataTypes) =>
    sequelize.define('Credential', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false,
            unique: true,
            allowNull: false,
           
        },
        provider: DataTypes.STRING,
        hashed_password: DataTypes.TEXT,
        salt: DataTypes.TEXT
    });