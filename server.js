const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const port = 8080;
const listViewRouter = require("./list-view-router");
const listEditRouter = require("./list-edit-router");

app.use(express.json());
app.use(bodyParser.json());

app.get("/Tareas", (req, res) => {
  try {
    const data = fs.readFileSync("tareas.json", "utf-8");
    const parsedData = JSON.parse(data);
    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ error: "Error al leer el archivo de tareas" });
  }
});

app.post("/Tareas", (req, res) => {
  try {
    // Lee las tareas existentes del archivo
    const data = fs.readFileSync("tareas.json", "utf-8");
    const tareas = JSON.parse(data);

    // Obtén la nueva tarea desde el cuerpo de la solicitud
    const nuevaTarea = req.body.tareas;

    // Agrega la nueva tarea al arreglo de tareas
    tareas.push(nuevaTarea);

    // Guarda las tareas actualizadas en el archivo
    fs.writeFileSync("tareas.json", JSON.stringify(tareas, null, 2), "utf-8");

    res.status(201).send({ mensaje: "Tarea creada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al crear la tarea" });
  }
});

app.put("/Tareas/:id", (req, res) => {
  try {
    // Lee las tareas existentes del archivo
    const data = fs.readFileSync("tareas.json", "utf-8");
    const tareas = JSON.parse(data);

    // Obtén el ID de la tarea a actualizar desde los parámetros de la URL
    const tareaId = req.params.id;

    // Encuentra la tarea con el ID correspondiente en el arreglo de tareas
    const tareaIndex = tareas.findIndex((tarea) => tarea.id === tareaId);

    if (tareaIndex === -1) {
      // Si no se encuentra la tarea, responde con un código 404 (No encontrado)
      return res.status(404).send({ mensaje: "Tarea no encontrada" });
    }

    // Actualiza la tarea con los nuevos datos del cuerpo de la solicitud
    tareas[tareaIndex] = { ...tareas[tareaIndex], ...req.body };

    // Guarda las tareas actualizadas en el archivo
    fs.writeFileSync("tareas.json", JSON.stringify(tareas, null, 2), "utf-8");

    res.status(200).send({ mensaje: "Tarea actualizada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al actualizar la tarea" });
  }
});

app.delete("/Tareas/:id", (req, res) => {
  try {
    // Lee las tareas existentes del archivo
    const data = fs.readFileSync("tareas.json", "utf-8");
    const tareas = JSON.parse(data);

    // Obtén el ID de la tarea a eliminar desde los parámetros de la URL
    const tareaId = req.params.id;

    // Filtra las tareas para excluir la tarea con el ID correspondiente
    const tareasActualizadas = tareas.filter((tarea) => tarea.id !== tareaId);

    // Verifica si alguna tarea fue eliminada
    if (tareasActualizadas.length === tareas.length) {
      // Si no se encuentra la tarea, responde con un código 404 (No encontrado)
      return res.status(404).send({ mensaje: "Tarea no encontrada" });
    }

    // Guarda las tareas actualizadas en el archivo
    fs.writeFileSync(
      "tareas.json",
      JSON.stringify(tareasActualizadas, null, 2),
      "utf-8"
    );

    res.status(200).send({ mensaje: "Tarea eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al eliminar la tarea" });
  }
});

const writeTasksToFile = (tasks) => {
  fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2), "utf-8");
};

const autMiddleware = (req, res, next) => {
  const heaterToken = req.headers.autorizacion;
  if (!heaterToken) {
    return res.status(400).send({ error: "No existe el token" });
  }

  jwt.verify(heaterToken, process.env.SECRETKEY, (err, decoded) => {
    if (err) {
      res.status(400).send({ error: "Token invalido" });
    }
  });

  //req.rol = decoded;
  next();
};

const users = [
  {
    username: "daniel90",
    pass: "1234",
    email: "daniel@example.com",
    name: "admin",
    rol: "admin",
  },
  {
    username: "sebas15",
    pass: "12345",
    email: "sebastian@example.com",
    name: "user",
    rol: "user",
  },
  {
    username: "isa22",
    pass: "123456",
    email: "isabel@example.com",
    name: "user",
    rol: "user",
  },
];

app.post("/login", (req, res) => {
  const { email, pass } = req.body;

  const user = users.find((users) => users.email === email);

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Crea un token JWT
  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.SECRETKEY,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

app.get("/confidencial", autMiddleware, (req, res) => {
  res.send({ bienvenido: "Accediste a el sistema confidencial de pagos" });
});

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
