// modules
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// import files
const routers = require("./src/router/index");
const sequelize = require("./src/config/database");

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// database
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection Database: Success!");
  })
  .catch((err) => {
    console.error("Connection Database: [ERROR] ", err);
  });

// carregar arq estáticos
app.use(express.static("public"));

// chamando as rotas
app.use(express.json());
app.use("/", routers);

// server
app.listen(8080, () => {
  console.log("serve at running! | http://localhost:8080");
});

// Documents\udemyNodejs\SECAO-007\guiaPress