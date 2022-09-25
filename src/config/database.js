const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("guiapress", "root", "noob0987", {
  host: "localhost",
  dialect: "mysql",
  timezone: "-03:00",
});

module.exports = sequelize;
