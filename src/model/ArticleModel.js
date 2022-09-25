const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./CategoryModel");

const Article = sequelize.define("articles", {
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
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

Category.hasMany(Article);
Article.belongsTo(Category);

// Article.sync({ force: true });

module.exports = Article;
