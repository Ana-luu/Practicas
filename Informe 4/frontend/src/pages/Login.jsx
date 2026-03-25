import { useState } from "react";
import { useNavigate } from "react-router-dom";
import facu from "../assets/FACU.jpg";

function Login() {
const navigate = useNavigate();

const [registro, setRegistro] = useState("");
const [password, setPassword] = useState("");

const iniciarSesion= async () => {
  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registro, password }),
    });

    if (res.ok) {
      const datosUsuario = await res.json(); // Aquí recibes el {id, nombres, apellidos...}
      
      // 1. Guardamos el objeto REAL en el localStorage
      localStorage.setItem("usuario", JSON.stringify(datosUsuario));
      
      // 2. Redirigimos al Home (asegúrate que la ruta sea "/" o "/home" según tu App.jsx)
      navigate("/home"); 
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error en login:", error);
  }
};
return (
    <div style={styles.container}>
    <div style={styles.card}>
        
        <img src={facu} alt="facu" style={styles.image} />

        <h2>FACULTAD DE INGENIERIA</h2>

        <input
        type="registro"
        placeholder="Registro"
        value={registro}
        onChange={(e) => setRegistro(e.target.value)}
        style={styles.input}
        />

        <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
        />

        <button onClick={iniciarSesion} style={styles.button}>
        Ingresar
        </button>

        <button 
        onClick={() => navigate("/registro")} 
        style={styles.buttonSecondary}
        >
        Crear cuenta
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
    width: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
},
image: {
    width: "100px",
    marginBottom: "10px"
},
input: {
    display: "block",
    width: "100%",
    margin: "10px 0",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
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

export default Login;