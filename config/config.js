module.exports = {
  port: process.env.PORT || 3000,
  db: {
    database: process.env.DB_NAME || "crypto_acquiring",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "root",
    options: {
      dialect: process.env.DIALECT || "postgres",
      host: process.env.HOST || "localhost",
    },
  },
};
