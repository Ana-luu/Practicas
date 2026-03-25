import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Home from "./pages/Home";
import CrearPublicacion from "./pages/CrearPublicacion";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/home" element={<Home />} />
      <Route path="/crear-publicacion" element={<CrearPublicacion />} />
    </Routes>
  );
}

export default App;
