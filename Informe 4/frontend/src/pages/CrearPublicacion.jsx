import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import facu from "../assets/FACU.jpg";

function CrearPublicacion() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [tipo, setTipo] = useState("curso");
  const [cursos, setCursos] = useState([]);
  const [catedraticos, setCatedraticos] = useState([]);
  const [seleccionId, setSeleccionId] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!usuario) { navigate("/"); return; }
    fetch("http://localhost:3000/cursos").then(r => r.json()).then(setCursos);
    fetch("http://localhost:3000/catedraticos").then(r => r.json()).then(setCatedraticos);
  }, []);

  const publicar = async () => {
    if (!seleccionId || !mensaje.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    const body = {
      usuario_id: usuario.id,
      mensaje,
      curso_id: tipo === "curso" ? seleccionId : null,
      catedratico_id: tipo === "catedratico" ? seleccionId : null,
    };

    const res = await fetch("http://localhost:3000/publicaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("¡Publicación creada!");
      navigate("/home");
    } else {
      alert("Error al crear publicación");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <img src={facu} alt="facu" style={styles.navLogo} />
          <span style={styles.navTitle}>Ingeniería USAC</span>
        </div>
        <button onClick={() => navigate("/home")} style={styles.btnVolver}>
          ← Volver
        </button>
      </div>

      <div style={styles.body}>
        <div style={styles.card}>
          <h2 style={styles.titulo}>Nueva Publicación</h2>
          <p style={styles.subtitulo}>¿Sobre qué quieres opinar?</p>

          <div style={styles.tipoSelector}>
            <button
              style={tipo === "curso" ? styles.tipoActivo : styles.tipoBtn}
              onClick={() => { setTipo("curso"); setSeleccionId(""); }}
            >
              📚 Curso
            </button>
            <button
              style={tipo === "catedratico" ? styles.tipoActivo : styles.tipoBtn}
              onClick={() => { setTipo("catedratico"); setSeleccionId(""); }}
            >
              👨‍🏫 Catedrático
            </button>
          </div>

          <label style={styles.label}>
            Selecciona un {tipo === "curso" ? "curso" : "catedrático"}:
          </label>
          <select
            value={seleccionId}
            onChange={(e) => setSeleccionId(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Selecciona --</option>
            {(tipo === "curso" ? cursos : catedraticos).map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </select>

          <label style={styles.label}>Tu opinión:</label>
          <textarea
            placeholder="Escribe aquí tu publicación..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={5}
            style={styles.textarea}
          />

          <button onClick={publicar} style={styles.btnPublicar}>
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f0f2f5", fontFamily: "Poppins, sans-serif" },
  navbar: {
    backgroundColor: "#1d3557", padding: "12px 30px",
    display: "flex", justifyContent: "space-between", alignItems: "center"
  },
  navLeft: { display: "flex", alignItems: "center", gap: "10px" },
  navLogo: { width: "40px", borderRadius: "50%" },
  navTitle: { color: "white", fontWeight: "bold", fontSize: "18px" },
  btnVolver: {
    backgroundColor: "transparent", color: "white",
    border: "1px solid white", padding: "8px 16px",
    borderRadius: "8px", cursor: "pointer"
  },
  body: { display: "flex", justifyContent: "center", padding: "40px 20px" },
  card: {
    backgroundColor: "white", borderRadius: "16px", padding: "36px",
    width: "100%", maxWidth: "560px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
  },
  titulo: { color: "#1d3557", margin: "0 0 4px", fontSize: "24px" },
  subtitulo: { color: "#888", marginBottom: "24px" },
  tipoSelector: { display: "flex", gap: "12px", marginBottom: "24px" },
  tipoBtn: {
    flex: 1, padding: "10px", borderRadius: "10px",
    border: "2px solid #ddd", backgroundColor: "white",
    cursor: "pointer", fontSize: "15px"
  },
  tipoActivo: {
    flex: 1, padding: "10px", borderRadius: "10px",
    border: "2px solid #1d3557", backgroundColor: "#1d3557",
    color: "white", cursor: "pointer", fontSize: "15px", fontWeight: "bold"
  },
  label: { display: "block", fontSize: "14px", color: "#555", marginBottom: "6px", fontWeight: "bold" },
  select: {
    width: "100%", padding: "10px", borderRadius: "8px",
    border: "1px solid #ccc", marginBottom: "20px",
    fontSize: "14px", boxSizing: "border-box"
  },
  textarea: {
    width: "100%", padding: "12px", borderRadius: "8px",
    border: "1px solid #ccc", marginBottom: "20px",
    fontSize: "14px", resize: "vertical", boxSizing: "border-box",
    fontFamily: "Poppins, sans-serif"
  },
  btnPublicar: {
    width: "100%", padding: "12px", borderRadius: "10px",
    border: "none", backgroundColor: "#1d3557", color: "white",
    fontSize: "16px", fontWeight: "bold", cursor: "pointer"
  },
};

export default CrearPublicacion;
