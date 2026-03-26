import { useState } from "react";
import { useNavigate } from "react-router-dom";
import facu from "../assets/FACU.jpg";

function Registro() {
  const navigate = useNavigate();

  const [registro, setRegistro] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [modalMensaje, setModalMensaje] = useState("");

  const registrar = async () => {
    try {
      const res = await fetch("http://localhost:3000/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registro, nombres, apellidos, correo, password })
      });

      if (res.ok) {
        setModalMensaje("¡Registro exitoso! Ahora inicia sesión.");
        navigate("/");
      } else {
        const data = await res.text();
        setModalMensaje("Error: " + data);
      }
    } catch (error) {
      console.log(error);
      setModalMensaje("Error al registrar");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={facu} alt="facu" style={styles.image} />
        <h2>REGISTRO</h2>

        <input
          placeholder="Registro Academico"
          onChange={(e) => setRegistro(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Nombres"
          onChange={(e) => setNombres(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Apellidos"
          onChange={(e) => setApellidos(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Correo"
          onChange={(e) => setCorreo(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={registrar} style={styles.button}>
          Registrarse
        </button>
        <button onClick={() => navigate("/")} style={styles.buttonSecondary}>
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    fontFamily: "Poppins, sans-serif"
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  image: { width: "90px", borderRadius: "50%", marginBottom: "10px" },
  input: {
    display: "block",
    width: "100%",
    margin: "8px 0",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    textAlign: "center",
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1d3557",
    color: "white",
    cursor: "pointer",
    marginTop: "10px"
  },
  buttonSecondary: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #1d3557",
    backgroundColor: "white",
    color: "#1d3557",
    cursor: "pointer",
    marginTop: "10px"
  }
};

export default Registro;