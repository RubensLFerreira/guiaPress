// Modulos
const express = require("express");
const router = express.Router();
const slugify = require("slugify");

// Modelo
const Category = require("../../model/CategoryModel");

// Autenticação
const adminAuth = require("../../middleware/adminAuth");

// Tela para criar nova categoria
router.get("/admin/new", adminAuth, (req, res) => {
  res.render("pages/admin/categories/new.ejs");
});

// Enviando dados para criar categoria
router.post("/save", (req, res) => {
  const title = req.body.title;

  if (!title) {
    res.redirect("/categories/admin/new");
  } else {
    Category.create({
      title,
      slug: slugify(title), // vai tratar a string para ser usado nas rotas
    }).then(() => {
      res.redirect("/categories/admin");
    });
  }
});

// Tabela de categorias
router.get("/admin", adminAuth, (req, res) => {
  Category.findAll().then((categories) => {
    res.render("pages/admin/categories/index.ejs", {
      categories,
    });
  });
});

// Enviando dados p/ excluir categoria
router.post("/admin/delete", (req, res) => {
  const id = req.body.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({
        where: { id: id },
      }).then(() => {
        res.redirect("/categories/admin");
      });
    } else {
      res.redirect("/categories/admin");
    }
  } else {
    res.redirect("/categories/admin");
  }
});

// Tela para editar categoria
router.get("/admin/edit/:id", adminAuth, (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    res.redirect("/categories/admin");
  }

  Category.findByPk(id)
    .then((category) => {
      if (category != undefined) {
        res.render("pages/admin/categories/edit.ejs", { category });
      } else {
        res.redirect("/categories/admin");
      }
    })
    .catch((err) => {
      res.redirect("/categories/admin");
    });
});

// Enviando os dados p/ editar categoria
router.post("/admin/update", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;

  Category.update({ title, slug: slugify(title) }, { where: { id: id } }).then(
    () => {
      res.redirect("/categories/admin");
    }
  );
});

module.exports = router;
