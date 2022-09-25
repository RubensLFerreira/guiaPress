// Modulos
const express = require("express");
const router = express.Router();
const session = require("express-session");

// importando modelos
const Category = require("../model/CategoryModel");
const Article = require("../model/ArticleModel");
const User = require("../model/UserModel");

// sessões
router.use(
  session({
    secret: "segredo",
    cookie: { maxAge: 3000000 },
    resave: true,
    saveUninitialized: true,
  })
);

// View
const app = express();
app.set("view engine", "ejs");

// Categories
const categories = require("../controller/categories/categories");
router.use("/categories", categories);

// Articles
const articles = require("../controller/articles/articles");
router.use("/articles", articles);

// Users
const users = require("../controller/users/users");
router.use("/users", users);

// Exibindo artigos na página home
router.get("/", (req, res) => {
  Article.findAll({ order: [["id", "desc"]], limit: 4 }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("pages/index.ejs", { categories, articles });
    });
  });
});

// Rota p/ exibir leitura do artigo
router.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  Article.findOne({
    where: { slug: slug },
    include: [
      {
        model: Category,
      },
    ],
  })
    .then((article) => {
      if (!article) {
        res.redirect("/");
        alert("Este artigo não existe");
      } else {
        res.render("pages/admin/articles/articles.ejs", { article });
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

// Exibir artigo por categoria
router.get("/category/:slug", (req, res) => {
  const slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render("pages/index.ejs", {
            articles: category.articles,
            categories: categories,
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
      alert("Houve um erro, você foi redirecionado!");
    });
});

module.exports = router;
