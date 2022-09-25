// Modulos
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Modelo
const User = require("../../model/UserModel");

// Autenticação
const adminAuth = require("../../middleware/adminAuth");

// Tabela com lista de usuários
router.get("/admin", adminAuth, (req, res) => {
  User.findAll().then((users) => {
    res.render("pages/admin/users/index.ejs", { users });
  });
});

// Criando novo usuário
router.get("/admin/create", (req, res) => {
  res.render("pages/admin/users/create.ejs");
});

// Enviando os dados p/ criar novo usuário
router.post("/create", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  User.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    if (user) {
      res.redirect("/users/admin/create");
    } else {
      User.create({
        name,
        email,
        password: hash,
      })
        .then(() => {
          res.redirect("/users/admin");
        })
        .catch((err) => {
          res.redirect("/");
        });
    }
  });
});

// Enviando os dados p/ excluir usuário
router.post("/admin/delete", (req, res) => {
  const id = req.body.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      User.destroy({
        where: { id: id },
      }).then(() => {
        res.redirect("/users/admin");
      });
    } else {
      res.redirect("/users/admin");
    }
  } else {
    res.redirect("/users/admin");
  }
});

// Tela de editar usuário
router.get("/admin/edit/:id", adminAuth, (req, res) => {
  const id = req.params.id;

  if (isNaN(id)) {
    res.redirect("/users/admin");
  }

  User.findByPk(id)
    .then((users) => {
      if (users != undefined) {
        res.render("pages/admin/users/edit.ejs", { users });
      } else {
        res.redirect("/users/admin");
      }
    })
    .catch((err) => {
      res.redirect("/users/admin");
    });
});

// Enviando dados para atualizar usuário
router.post("/admin/update", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  User.update({ name, email, password: hash }, { where: { id: id } }).then(
    () => {
      res.redirect("/users/admin");
    }
  );
});

// Tela de login
router.get("/login", (req, res) => {
  res.render("pages/admin/users/login.ejs");
});

// Autenticação do usuário
router.post("/authenticate", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    if (user != undefined) {
      var correct = bcrypt.compareSync(password, user.password);

      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        res.redirect("/");
      } else {
        res.redirect("/users/login");
      }
    } else {
      res.redirect("/users/login");
    }
  });
});

// Logout do usuário
router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

module.exports = router;
