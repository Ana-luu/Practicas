import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import facu from "../assets/FACU.jpg";
import Modal from "../Modal/Modal";

function Home() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [publicaciones, setPublicaciones] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [comentarios, setComentarios] = useState({});
  const [nuevoComentario, setNuevoComentario] = useState({});
  const [modalMensaje, setModalMensaje] = useState("");

  const cargarComentarios = async (publicacion_id) => {
    try {
      const res = await fetch(`http://localhost:3000/comentarios/${publicacion_id}`);
      if (res.ok) {
        const data = await res.json();
        setComentarios((prev) => ({ ...prev, [publicacion_id]: data }));
      }
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  };

  const cargarPublicaciones = async () => {
    try {
      const res = await fetch("http://localhost:3000/publicaciones");
      if (res.ok) {
        const data = await res.json();
        setPublicaciones(data);
        
        // Cargar comentarios usando for...of para evitar problemas de asincronía
        for (const p of data) {
          await cargarComentarios(p.id);
        }
      }
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    }
  };

  const agregarComentario = async (publicacion_id) => {
    const mensaje = nuevoComentario[publicacion_id];
    if (!mensaje || mensaje.trim() === "") return;

    try {
      const res = await fetch("http://localhost:3000/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: usuario.id, publicacion_id, mensaje }),
      });

      if (res.ok) {
        setNuevoComentario((prev) => ({ ...prev, [publicacion_id]: "" }));
        cargarComentarios(publicacion_id); 
      }
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };

  const buscarUsuario = async () => {
    if (!busquedaUsuario.trim()) return;
    try {
      const res = await fetch(`http://localhost:3000/usuario/${busquedaUsuario}`);
      if (res.ok) {
        const data = await res.json();
        setModalMensaje(`Usuario encontrado: ${data.nombres} ${data.apellidos} (${data.correo})`);
      } else {
        setModalMensaje("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar usuario:", error);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  useEffect(() => {
    if (!usuario) {
      navigate("/");
      return;
    }
    cargarPublicaciones();
  }, []);


  const publicacionesFiltradas = publicaciones.filter((p) => {
    if (filtro === "curso") {
      return p.curso_nombre && p.curso_nombre.toLowerCase().includes(busqueda.toLowerCase());
    }
    if (filtro === "catedratico") {
      return p.catedratico_nombre && p.catedratico_nombre.toLowerCase().includes(busqueda.toLowerCase());
    }
    return true;
  });


  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <img src={facu} alt="facu" style={styles.navLogo} />
          <span style={styles.navTitle}>Ingeniería USAC</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>Hola, {usuario?.registro}</span>
          <button onClick={() => navigate("/crear-publicacion")} style={styles.btnPublicar}>
            + Nueva publicación
          </button>
          <button onClick={cerrarSesion} style={styles.btnCerrar}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {modalMensaje && (
  <Modal 
    mensaje={modalMensaje} onClose={() => setModalMensaje("")}
  />
)}

      <div style={styles.body}>
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Filtros</h3>

          <button
            style={filtro === "todos" ? styles.filtroActivo : styles.filtroBtn}
            onClick={() => { setFiltro("todos"); setBusqueda(""); }}
          >
            Todos
          </button>
          <button
            style={filtro === "curso" ? styles.filtroActivo : styles.filtroBtn}
            onClick={() => setFiltro("curso")}
          >
            Por Curso
          </button>
          <button
            style={filtro === "catedratico" ? styles.filtroActivo : styles.filtroBtn}
            onClick={() => setFiltro("catedratico")}
          >
            Por Catedrático
          </button>

          {(filtro === "curso" || filtro === "catedratico") && (
            <input
              placeholder={filtro === "curso" ? "Nombre del curso..." : "Nombre del catedrático..."}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={styles.inputFiltro}
            />
          )}

          <hr style={{ margin: "20px 0", borderColor: "#e0e0e0" }} />

          <h3 style={styles.sidebarTitle}>Buscar usuario</h3>
          <input
            placeholder="Registro personal..."
            value={busquedaUsuario}
            onChange={(e) => setBusquedaUsuario(e.target.value)}
            style={styles.inputFiltro}
          />
          <button onClick={buscarUsuario} style={styles.btnBuscar}>
            Buscar
          </button>
        </div>

        <div style={styles.feed}>
          <h2 style={styles.feedTitle}>Publicaciones recientes</h2>

          {publicacionesFiltradas.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center" }}>No hay publicaciones todavía.</p>
          ) : (
            publicacionesFiltradas.map((pub) => (
              <div key={pub.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.avatar}>{pub.autor?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p style={styles.cardAutor}>{pub.autor}</p>
                    <p style={styles.cardFecha}>{new Date(pub.fecha).toLocaleDateString("es-GT", {
                      year: "numeric", month: "long", day: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}</p>
                  </div>
                </div>

                <div style={styles.cardTag}>
                  {pub.curso_nombre ? (
                    <span style={styles.tagCurso}>📚 {pub.curso_nombre}</span>
                  ) : (
                    <span style={styles.tagCatedratico}>👨‍🏫 {pub.catedratico_nombre}</span>
                  )}
                </div>

                <p style={styles.cardMensaje}>{pub.mensaje}</p>
                <div style={styles.comentariosSection}>
                  <p style={styles.comentariosTitle}>
                    💬 {comentarios[pub.id]?.length || 0} comentario(s)
                  </p>

                  {comentarios[pub.id]?.map((c) => (
                    <div key={c.id} style={styles.comentario}>
                      <span style={styles.comentarioAutor}>{c.autor}: </span>
                      <span>{c.mensaje}</span>
                    </div>
                  ))}

                  <div style={styles.comentarioInput}>
                    <input
                      placeholder="Escribe un comentario..."
                      value={nuevoComentario[pub.id] || ""}
                      onChange={(e) =>
                        setNuevoComentario((prev) => ({ ...prev, [pub.id]: e.target.value }))
                      }
                      style={styles.inputComentario}
                    />
                    <button onClick={() => agregarComentario(pub.id)} style={styles.btnComentario}>
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f0f2f5", fontFamily: "Poppins, sans-serif" },
  navbar: {
    backgroundColor: "#1d3557", padding: "12px 30px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
  },
  navLeft: { display: "flex", alignItems: "center", gap: "10px" },
  navLogo: { width: "40px", borderRadius: "50%" },
  navTitle: { color: "white", fontWeight: "bold", fontSize: "18px" },
  navRight: { display: "flex", alignItems: "center", gap: "12px" },
  navUser: { color: "#a8d8ea", fontSize: "14px" },
  btnPublicar: {
    backgroundColor: "#457b9d", color: "white", border: "none",
    padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
  },
  btnCerrar: {
    backgroundColor: "transparent", color: "#ccc", border: "1px solid #ccc",
    padding: "8px 16px", borderRadius: "8px", cursor: "pointer"
  },
  body: { display: "flex", maxWidth: "1100px", margin: "30px auto", gap: "24px", padding: "0 20px" },
  sidebar: {
    width: "220px", flexShrink: 0, backgroundColor: "white",
    borderRadius: "12px", padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)", height: "fit-content"
  },
  sidebarTitle: { fontSize: "14px", fontWeight: "bold", color: "#1d3557", marginBottom: "12px" },
  filtroBtn: {
    display: "block", width: "100%", padding: "8px 12px", marginBottom: "8px",
    borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "white",
    cursor: "pointer", textAlign: "left", fontSize: "14px"
  },
  filtroActivo: {
    display: "block", width: "100%", padding: "8px 12px", marginBottom: "8px",
    borderRadius: "8px", border: "none", backgroundColor: "#1d3557",
    color: "white", cursor: "pointer", textAlign: "left", fontSize: "14px", fontWeight: "bold"
  },
  inputFiltro: {
    width: "100%", padding: "8px", borderRadius: "8px",
    border: "1px solid #ccc", marginTop: "8px", fontSize: "13px", boxSizing: "border-box"
  },
  btnBuscar: {
    marginTop: "8px", width: "100%", padding: "8px", borderRadius: "8px",
    border: "none", backgroundColor: "#457b9d", color: "white", cursor: "pointer"
  },
  feed: { flex: 1 },
  feedTitle: { fontSize: "20px", color: "#1d3557", marginBottom: "20px" },
  card: {
    backgroundColor: "white", borderRadius: "12px", padding: "20px",
    marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  },
  cardHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" },
  avatar: {
    width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "#1d3557",
    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "bold", fontSize: "18px", flexShrink: 0
  },
  cardAutor: { margin: 0, fontWeight: "bold", color: "#1d3557" },
  cardFecha: { margin: 0, fontSize: "12px", color: "#888" },
  cardTag: { marginBottom: "10px" },
  tagCurso: {
    backgroundColor: "#e8f4f8", color: "#1d3557", padding: "4px 10px",
    borderRadius: "20px", fontSize: "13px", fontWeight: "bold"
  },
  tagCatedratico: {
    backgroundColor: "#fef3e2", color: "#e07b00", padding: "4px 10px",
    borderRadius: "20px", fontSize: "13px", fontWeight: "bold"
  },
  cardMensaje: { color: "#333", lineHeight: "1.6", margin: "10px 0" },
  comentariosSection: { borderTop: "1px solid #f0f0f0", paddingTop: "12px", marginTop: "12px" },
  comentariosTitle: { fontSize: "13px", color: "#888", margin: "0 0 8px" },
  comentario: {
    backgroundColor: "#f8f9fa", padding: "8px 12px",
    borderRadius: "8px", marginBottom: "6px", fontSize: "13px"
  },
  comentarioAutor: { fontWeight: "bold", color: "#1d3557" },
  comentarioInput: { display: "flex", gap: "8px", marginTop: "8px" },
  inputComentario: {
    flex: 1, padding: "8px", borderRadius: "8px",
    border: "1px solid #ddd", fontSize: "13px"
  },
  btnComentario: {
    padding: "8px 14px", borderRadius: "8px", border: "none",
    backgroundColor: "#1d3557", color: "white", cursor: "pointer", fontSize: "13px"
  },
};

export default Home;