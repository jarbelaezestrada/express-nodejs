const express = require("express");
const listEditRouter = express.Router();
const tareas = require("./tareas.json");

listEditRouter.use(express.json());

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
