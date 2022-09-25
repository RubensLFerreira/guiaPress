const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("categories", {
  id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Category.sync({ force: true });

module.exports = Category;
