const express = require("express");
const listViewRouter = express.Router();
const tareas = require("./tareas.json");
console.log(tareas);

listViewRouter.use(express.json());

listViewRouter.get("/listatareas", (req, res) => {
  res.status(200).send("tareas completadas y no completadas");
});

listViewRouter.get("/listatareas/:isCompleted", (req, res) => {
  const tareaC = req.params.isCompleted;
  const booleantareaC = tareaC === "true";
  console.log(tareaC);
  const tareaFilter = tareas.filter(
    (tareas) => tareas.isCompleted === booleantareaC
  );
  res.send(tareaFilter);
});

module.exports = listViewRouter;
