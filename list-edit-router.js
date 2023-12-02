const express = require("express");
const listEditRouter = express.Router();
const tareas = require("./tareas.json");

const manejoErr = function (req, res, next) {
  if (req.method === "POST") {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send("No se puede enviar un cuerpo vacio");
    }
    if (
      !Object.hasOwn(req.body, "id") ||
      !Object.hasOwn(req.body, "isCompleted") ||
      !Object.hasOwn(req.body, "description")
    ) {
      res
        .status(404)
        .send("No se puede enviar porque no contiene todos los atributos.");
    }
  }
  if (req.method === "PUT") {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send("No se puede enviar un cuerpo vacio");
    }
    if (
      !Object.hasOwn(req.body, "id") ||
      !Object.hasOwn(req.body, "isCompleted") ||
      !Object.hasOwn(req.body, "description")
    ) {
      res
        .status(404)
        .send("No se puede enviar porque los atributos no son correctos.");
    }
  }
  next();
};

listEditRouter.use(express.json());
listEditRouter.use(manejoErr);

listEditRouter.post("/listaTareas/addtarea", (req, res) => {
  const nuevaTarea = req.body;
  tareas.push(nuevaTarea);
  res.status(200).send(tareas);
  console.log(tareas);
});

listEditRouter.put("/listatareas/actualizar/:id", (req, res) => {
  const id = req.params.id;
  const tareaPut = req.body;
  const index = tareas.findIndex((tareas) => tareas.id == id);
  tareas[index] = tareaPut;
  console.log(index);
  res.send(tareas);
});

listEditRouter.delete("/listatareas/eliminar/:id", (req, res) => {
  const id = req.params.id;
  const tareasFilter = tareas.filter((tarea) => tarea.id !== id);
  //tareas.slice(tareasFilter,1010);
  res.status(200).send({ tareas: tareasFilter });
});

module.exports = listEditRouter;
