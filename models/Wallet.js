module.exports = (sequelize, DataTypes) =>
  sequelize.define("Wallet", {
    user_id: {
      type: DataTypes.INTEGER,
    },
    network: DataTypes.INTEGER,
    wallet_type: DataTypes.INTEGER,
    name: DataTypes.STRING,
    info: DataTypes.STRING,
    wallet_addrs: DataTypes.STRING,
    myUNID: {
      type: DataTypes.STRING,
      unique: true,
    },
  }, {
    timestamps: true,
  });
