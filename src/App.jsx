
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import './App.css';
import Categorias from "./views/categorias"
import Encabezado from "./components/encabezado/Encabezado";
import Producto from "./views/productos";
import Catalogo from "./views/CatalogoProductos"
import RutaProtegida from "./components/rutas/RutaProtegida";
import PiePagina from "./infopie/PiePagina";


const AppInner = () => {
  const location = useLocation();
  const hideHeader = location.pathname === "/login";

  return (
    <div className="App-wrapper">
      {!hideHeader && <Encabezado />}
      <main className="margen-superior-main content">
        <Routes>
          {/* Definicion de rutas */}
          <Route path="/" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inicio" element={<RutaProtegida vista={<Inicio />} />} />
          <Route path="/productos" element={<RutaProtegida vista={<Producto />} roleRequired={"administrador"} />} />
          <Route path="/categorias" element={<RutaProtegida vista={<Categorias />} roleRequired={"administrador"} />} />
          <Route path="/CatalogoProductos" element={<Catalogo />} />
        </Routes>
      </main>
      <PiePagina />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppInner />
    </Router>
  );
};

export default App;