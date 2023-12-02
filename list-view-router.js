const express = require("express");
const listViewRouter = express.Router();
const tareas = require("./tareas.json");

const correctParams = function (req, res, next) {
  const existTarea = req.params.isCompleted;
  if (existTarea !== "true" && existTarea !== "false") {
    res.status(404).send("No existe una tarea con este estado");
  }
  console.log(existTarea);
  next();
};

listViewRouter.use(express.json());

listViewRouter.get("/listatareas", (req, res) => {
  res.status(200).send("tareas completadas y no completadas");
});

listViewRouter.get("/listatareas/:isCompleted", correctParams, (req, res) => {
  const tareaC = req.params.isCompleted;
  const booleantareaC = tareaC === "true";
  console.log(tareaC);
  const tareaFilter = tareas.filter(
    (tareas) => tareas.isCompleted === booleantareaC
  );
  res.send(tareaFilter);
});

module.exports = listViewRouter;
