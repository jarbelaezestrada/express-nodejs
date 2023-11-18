const express = require("express");
const app = express();
const port = 3000;

const hervirAgua = (req, res, next) => {
  console.log("calentar el agua 💧");
  next();
};

const ponerBolsaDeTe = (req, res, next) => {
  console.log("poner la bolsa de te en un pocillo 🍵");
  next();
};

app.get("/te/tazadete", hervirAgua, ponerBolsaDeTe, (req, res) => {
  console.log("poner el agua hervida en la taza con la bolsa de te");
  res.send("Listo el té para tomar 🍵👏");
});

app.post("/", (req, res) => {
  res.send(req.body);
});

app.put("/", (req, res) => {
  //Actualizar recurso
  res.send("El recurso ha sido actualizado");
});

app.delete("/", (req, res) => {
  //Eliminar recurso
  res.send("El recurso se ha eliminado");
});

app.options("/", (req, res) => {
  //
  res.send({
    Allow: ["GET", "POST", "PUT", "DELETE"],
  });
});
app.listen(port, () => {
  console.log(`Servidor ejecutandose en el puerto http://localhost:${port}`);
});
