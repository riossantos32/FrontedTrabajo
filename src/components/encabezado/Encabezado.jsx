import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo_lunaSeda.jpg";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Encabezado.css";
import CuadroBusquedas from "../busquedas/CuadroBusquedas";
import "../busquedas/Buscador.css";

const Encabezado = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const estaLogueado = !!localStorage.getItem("usuario");

  const cerrarSesion = () => {
    setMenuAbierto(false);
    localStorage.removeItem("usuario");
    localStorage.removeItem("contraseña");
    localStorage.removeItem("role");
    navegar("/login");
  };

  const navegarA = (ruta) => {
    navegar(ruta);
    setMenuAbierto(false);
  };

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Obtener role para mostrar opciones específicas
  const role = localStorage.getItem("role") || 'usuario';

  const manejarSeleccionProducto = (producto) => {
    // Emitir búsqueda global para que el catálogo se filtre
    try {
      window.dispatchEvent(new CustomEvent('global-search', { detail: producto.nombre_producto }));
    } catch (err) {
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('global-search', true, true, producto.nombre_producto);
      window.dispatchEvent(evt);
    }

    // Si está logueado, agregar producto a almacenamiento del usuario
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      try {
        const key = `mis_productos_${usuario}`;
        const prev = JSON.parse(localStorage.getItem(key) || '[]');
        // Guardamos solo id y fecha para evitar datos pesados
        const existe = prev.find(p => p.id_producto === producto.id_producto);
        if (!existe) prev.unshift({ id_producto: producto.id_producto, nombre: producto.nombre_producto, fecha: Date.now() });
        localStorage.setItem(key, JSON.stringify(prev.slice(0, 100)));
      } catch (err) {
        // ignore
      }
    }

    // Navegar al catálogo para ver resultados
    navegar('/CatalogoProductos');
  };

  return (
    <>
      <nav className="navbar">
        <div
          className="navbar-brand"
          onClick={() => {
            if (!estaLogueado) {
              navegarA("/");
            } else if (role === 'administrador') {
              navegarA('/productos');
            } else {
              navegarA('/CatalogoProductos');
            }
          }}
        >
          <img className="logoLunaYSeda" alt="Logo Luna & Seda" src={logo} />
          <strong>Luna & Seda</strong>
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          <i className="bi bi-list"></i>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {role === 'usuario' && (
            <div style={{ minWidth: 240 }}>
              <CuadroBusquedas onSelectProduct={manejarSeleccionProducto} />
            </div>
          )}
          <div className="navbar-links">
          {estaLogueado ? (
            <>
              {role === 'administrador' ? (
                <>
                  <a onClick={() => navegarA('/productos')} className="nav-link">
                    <i className="bi-box2-heart-fill me-2"></i>
                    Gestión de Productos
                  </a>
                  <a onClick={() => navegarA('/categorias')} className="nav-link">
                    <i className="bi-bookmarks-fill me-2"></i>
                    Gestión de Categorías
                  </a>
                  
                </>
              ) : (
                <>
                  <a onClick={() => navegarA('/CatalogoProductos')} className="nav-link">
                    <i className="bi-images me-2"></i>
                    Catálogo
                  </a>
                </>
              )}

              <a onClick={cerrarSesion} className="nav-link">
                Cerrar Sesión
              </a>
              <a onClick={() => navegarA('/login')} className="nav-link">
                <i className="bi-person-circle me-2"></i>
                Perfil
              </a>
            </>
          ) : (
            <a onClick={() => navegarA('/login')} className="nav-link">
              <i className="bi-person-circle me-2"></i>
              <strong>Inicie sesion</strong>
            </a>
          )}
          </div>
        </div>
      </nav>

      {/* Offcanvas Menu for Mobile */}
      <div className={`offcanvas-menu ${menuAbierto ? "open" : ""}`}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menú</h5>
          <button className="offcanvas-close" onClick={toggleMenu}>
            &times;
          </button>
        </div>
        <div className="offcanvas-body">
          {estaLogueado ? (
            <>
              {role === 'administrador' ? (
                <>
                  <a onClick={() => navegarA('/productos')} className="nav-link">
                    Gestión de Productos
                  </a>
                  <a onClick={() => navegarA('/categorias')} className="nav-link">
                    Gestión de Categorías
                  </a>
                 
                </>
              ) : (
                <>
                 
                </>
              )}

              <a onClick={cerrarSesion} className="nav-link">
                Cerrar Sesión
              </a>
            </>
          ) : (
            <a onClick={() => navegarA('/login')} className="nav-link">
              Inicie sesion
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default Encabezado;

