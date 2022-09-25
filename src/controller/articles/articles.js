// Modulos
const express = require("express");
const router = express.Router();
const slugify = require("slugify");

// Modelos
const Category = require("../../model/CategoryModel");
const Article = require("../../model/ArticleModel");

// Autenticação
const adminAuth = require("../../middleware/adminAuth");

// Renderizando tabela de artigos
router.get("/admin", adminAuth, (req, res) => {
  Article.findAll({
    include: [
      {
        model: Category,
      },
    ],
    order: [["id", "desc"]],
  }).then((articles) => {
    res.render("pages/admin/articles/index.ejs", { articles });
  });
});

// Tela de novo artigo
router.get("/admin/new", adminAuth, (req, res) => {
  Category.findAll().then((categories) => {
    res.render("pages/admin/articles/new.ejs", { categories });
  });
});

// Enviando dados de novo artigo
router.post("/save", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const categoryId = req.body.category;

  if (!title) {
    alert("Este título já está sendo usado!");
  } else {
    Article.create({
      title,
      slug: slugify(title),
      body,
      categoryId,
    }).then(() => {
      res.redirect("/articles/admin");
    });
  }
});

// Apagando artigo
router.post("/admin/delete", (req, res) => {
  const id = req.body.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: { id: id },
      }).then(() => {
        res.redirect("/articles/admin");
      });
    } else {
      res.redirect("/articles/admin");
    }
  } else {
    res.redirect("/articles/admin");
  }
});

// Tela de editar artigo
router.get("/admin/edit/:id", adminAuth, (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    res.redirect("/articles/admin");
  }

  Article.findByPk(id)
    .then((articles) => {
      if (articles != undefined) {
        Category.findAll().then((categories) => {
          res.render("pages/admin/articles/edit.ejs", { categories, articles });
        });
      } else {
        res.redirect("/articles/admin");
      }
    })
    .catch((err) => {
      res.redirect("/articles/admin");
    });
});

// Enviando dados para ediar artigo
router.post("/admin/update", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const body = req.body.body;
  const category = req.body.category;

  Article.update(
    {
      title,
      body,
      categoryId: category,
      slug: slugify(title),
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then(() => {
      res.redirect("/articles/admin");
    })
    .catch((err) => {
      res.redirect("/articles/admin");
    });
});

// Paginacao da página home
router.get("/page/:num", (req, res) => {
  const page = req.params.num;
  var offset = 0;

  if (isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * 4;
  }

  Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [["id", "desc"]],
  }).then((articles) => {
    var next = true;

    if (offset + 4 >= articles.count) {
      next = false;
    } else {
      next = true;
    }

    var result = {
      page: parseInt(page),
      next,
      articles,
    };

    Category.findAll().then((categories) => {
      res.render("pages/admin/articles/page.ejs", {
        result,
        categories,
        articles,
      });
    });
  });
});

module.exports = router;
