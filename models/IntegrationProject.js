// models/integrationProject.js

module.exports = (sequelize, DataTypes) => 
    sequelize.define('IntegrationProject', {
        user_id: {
            type: DataTypes.INTEGER,
        },
        domain: {
            type: DataTypes.STRING,
        },
        webhook: {
            type: DataTypes.STRING, 
        },
        integration_key: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.TEXT,
        },
        network: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
        }
    });

