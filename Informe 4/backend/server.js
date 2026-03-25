const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");

app.use(cors());
app.use(express.json());

// ─── USUARIOS ────────────────────────────────────────────

app.post("/registro", (req, res) => {
  const { registro, nombres, apellidos, correo, password } = req.body;
  const sql = "INSERT INTO usuarios (registro, nombres, apellidos, correo, password) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [registro, nombres, apellidos, correo, password], (err) => {
    if (err) {
      console.log("ERROR REGISTRO:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.send("Usuario registrado");
    }
  });
});

app.post("/login", (req, res) => {
  const { registro, password } = req.body;
  
  // Seleccionamos los datos que necesitamos para el resto de la app
  const sql = "SELECT id, nombres, apellidos, registro FROM usuarios WHERE registro = ? AND password = ?";

  db.query(sql, [registro, password], (err, result) => {
    if (err) {
      res.status(500).send("Error en el servidor");
    } else {
      if (result.length > 0) {
        // EN LUGAR DE res.send("Login correcto"), mandamos el objeto:
        res.json(result[0]); 
      } else {
        res.status(401).send("Usuario o contraseña incorrectos");
      }
    }
  });
});

app.get("/usuario/:registro", (req, res) => {
  const sql = "SELECT id, registro, nombres, apellidos, correo FROM usuarios WHERE registro = ?";
  db.query(sql, [req.params.registro], (err, result) => {
    if (err) { res.status(500).send("Error"); }
    else if (result.length > 0) res.json(result[0]);
    else res.status(404).send("Usuario no encontrado");
  });
});

// ─── CURSOS ───────────────────────────────────────────────

app.get("/cursos", (req, res) => {
  db.query("SELECT * FROM cursos", (err, result) => {
    if (err) res.status(500).send("Error");
    else res.json(result);
  });
});

// ─── CATEDRATICOS ─────────────────────────────────────────

app.get("/catedraticos", (req, res) => {
  db.query("SELECT * FROM catedraticos", (err, result) => {
    if (err) res.status(500).send("Error");
    else res.json(result);
  });
});

// ─── PUBLICACIONES ────────────────────────────────────────

app.get("/publicaciones", (req, res) => {
  const sql = `
    SELECT 
      p.id, p.mensaje, p.fecha,
      CONCAT(u.nombres, ' ', u.apellidos) AS autor,
      c.nombre AS curso_nombre,
      cat.nombre AS catedratico_nombre
    FROM publicaciones p
    JOIN usuarios u ON p.usuario_id = u.id
    LEFT JOIN cursos c ON p.curso_id = c.id
    LEFT JOIN catedraticos cat ON p.catedratico_id = cat.id
    ORDER BY p.fecha DESC
  `;
  db.query(sql, (err, result) => {
    if (err) { console.log(err); res.status(500).send("Error"); }
    else res.json(result);
  });
});

app.post("/publicaciones", (req, res) => {
  const { usuario_id, curso_id, catedratico_id, mensaje } = req.body;
  const sql = "INSERT INTO publicaciones (usuario_id, curso_id, catedratico_id, mensaje) VALUES (?, ?, ?, ?)";
  db.query(sql, [usuario_id, curso_id || null, catedratico_id || null, mensaje], (err) => {
    if (err) { console.log(err); res.status(500).send("Error al crear publicación"); }
    else res.send("Publicación creada");
  });
});

// ─── COMENTARIOS ──────────────────────────────────────────

app.get("/comentarios/:publicacion_id", (req, res) => {
  const sql = `
    SELECT 
      c.id, c.mensaje, c.fecha,
      CONCAT(u.nombres, ' ', u.apellidos) AS autor
    FROM comentarios c
    JOIN usuarios u ON c.usuario_id = u.id
    WHERE c.publicacion_id = ?
    ORDER BY c.fecha ASC
  `;
  db.query(sql, [req.params.publicacion_id], (err, result) => {
    if (err) res.status(500).send("Error");
    else res.json(result);
  });
});
app.post("/comentarios", (req, res) => {
  const { usuario_id, publicacion_id, mensaje } = req.body;
  const sql = "INSERT INTO comentarios (usuario_id, publicacion_id, mensaje) VALUES (?, ?, ?)";
  db.query(sql, [usuario_id, publicacion_id, mensaje], (err) => {
    if (err) { console.log(err); res.status(500).send("Error al comentar"); }
    else res.send("Comentario agregado");
  });
});

app.post("/publicaciones-directas", (req, res) => {
  const { usuario_id, mensaje, nombre_entidad, tipo_entidad } = req.body;
  const tabla = tipo_entidad === "curso" ? "cursos" : "catedraticos";
  
  // 1. Insertar el nuevo curso o catedrático
  db.query(`INSERT INTO ${tabla} (nombre) VALUES (?)`, [nombre_entidad], (err, result) => {
    if (err) return res.status(500).send("Error al crear entidad");

    const nuevoId = result.insertId;
    const columnaId = tipo_entidad === "curso" ? "curso_id" : "catedratico_id";

    // 2. Insertar la publicación usando el ID recién creado
    const sqlPub = `INSERT INTO publicaciones (usuario_id, mensaje, ${columnaId}) VALUES (?, ?, ?)`;
    db.query(sqlPub, [usuario_id, mensaje, nuevoId], (err2) => {
      if (err2) return res.status(500).send("Error al crear publicación");
      res.send("Publicación creada exitosamente");
    });
  });
});

app.listen(3000, () => console.log("Servidor en puerto 3000"));