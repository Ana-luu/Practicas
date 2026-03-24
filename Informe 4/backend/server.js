const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");

app.use(cors());
app.use(express.json());

app.post("/registro", (req, res) => {
  const { registro, nombres, apellidos, correo, password } = req.body;

  const sql = "INSERT INTO usuarios (registro, nombres, apellidos, correo, password) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [registro, nombres, apellidos, correo, password], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error al registrar");
    } else {
      res.send("Usuario registrado");
    }
  });
});

app.listen(3000, () => {
  console.log("Servidor en puerto 3000");
});

app.post("/login", (req, res) => {
  const { correo, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE correo = ? AND password = ?";

  db.query(sql, [correo, password], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error en el servidor");
    } else {
      if (result.length > 0) {
        res.send("Login correcto ");
      } else {
        res.send("Usuario o contraseña incorrectos ");
      }
    }
  });
});