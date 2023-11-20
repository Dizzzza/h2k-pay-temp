module.exports = (sequelize, DataTypes) =>
  sequelize.define("Transaction", {
    id_order: {
        type: DataTypes.INTEGER
    },
    network: DataTypes.INTEGER,
    id_client: DataTypes.INTEGER,
    id_merchant: DataTypes.INTEGER,
    summ: DataTypes.INTEGER,
    token: DataTypes.STRING,
    token_id: DataTypes.INTEGER,
    product: DataTypes.STRING,
    hash: DataTypes.STRING,
    value: DataTypes.FLOAT
  });
