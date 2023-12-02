const express = require("express");
const app = express();
const port = 8080;
const listViewRouter = require("./list-view-router");
const listEditRouter = require("./list-edit-router");

app.use(express.json());

const metodos = function (req, res, next) {
  if (
    req.method !== "GET" &&
    req.method !== "POST" &&
    req.method !== "PUT" &&
    req.method !== "DELETE"
  ) {
    res.status(400).send("Metodo http no disponible");
  }
  console.log(req.method);
  next();
};

app.use(metodos);

app.use("/list-view", listViewRouter);
app.use("/list-edit", listEditRouter);

app.get("/", (req, res) => {
  res.status(200).send("Lista de tareas");
  req.body;
});

app.listen(port, () => {
  console.log(`Servidor en ejecucion \n http://localhost:${port}`);
});
