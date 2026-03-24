const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Admin01",
  database: "proyecto_web"
});

db.connect((err) => {
  if (err) {
    console.log("Error ", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

module.exports = db;