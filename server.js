const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const app = express();
const port = 8080;
const listViewRouter = require("./list-view-router");
const listEditRouter = require("./list-edit-router");

app.use(express.json());

const autMiddleware = ((req ,res , next) => {

    const heaterToken = req.headers.autorizacion;
    if (!heaterToken) {
      return res.status(400).send({ error: "No existe el token" });
    }

    jwt.verify(heaterToken, process.env.SECRETKEY, (err, decoded)=>{
      if (err){
        res.status(400).send({ error: "Token invalido"});
      }
    });

    //req.rol = decoded;
    next();
  
  });


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
