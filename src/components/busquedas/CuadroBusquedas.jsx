import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import './Buscador.css';

const CuadroBusquedas = ({ textoBusqueda = '', manejarCambioBusqueda, onSelectProduct }) => {
  const [query, setQuery] = useState(textoBusqueda || '');
  const [productos, setProductos] = useState([]);
  const [sugerencias, setSugerencias] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Cargar productos para sugerencias (una sola vez)
    const cargar = async () => {
      try {
        const res = await fetch('https://backend-aiven-4.onrender.com/api/productos');
        if (!res.ok) return;
        const datos = await res.json();
        setProductos(datos || []);
      } catch (err) {
        // ignore
      }
    };
    cargar();
  }, []);

  useEffect(() => {
    const handleClickFuera = (ev) => {
      if (wrapperRef.current && !wrapperRef.current.contains(ev.target)) setAbierto(false);
    };
    window.addEventListener('click', handleClickFuera);
    return () => window.removeEventListener('click', handleClickFuera);
  }, []);

  const actualizarQuery = (e) => {
    const texto = e.target.value;
    setQuery(texto);
    setAbierto(Boolean(texto.trim()));

    if (typeof manejarCambioBusqueda === 'function') manejarCambioBusqueda(e);

    // Emitir evento global-search
    try {
      window.dispatchEvent(new CustomEvent('global-search', { detail: texto }));
    } catch (err) {
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('global-search', true, true, texto);
      window.dispatchEvent(evt);
    }

    // Calcular sugerencias locales (top 6)
    const q = String(texto).toLowerCase();
    if (!q) {
      setSugerencias([]);
      return;
    }
    const matches = productos.filter(p => (p.nombre_producto || '').toLowerCase().includes(q) || (p.descripcion_producto || '').toLowerCase().includes(q));
    setSugerencias(matches.slice(0,6));
  };

  const manejarSeleccion = (producto) => {
    setQuery(producto.nombre_producto);
    setAbierto(false);

    // Llamar handler si existe (Encabezado pasará uno)
    if (typeof onSelectProduct === 'function') {
      onSelectProduct(producto);
      return;
    }

    // Por defecto emitimos búsqueda global con el nombre
    try {
      window.dispatchEvent(new CustomEvent('global-search', { detail: producto.nombre_producto }));
    } catch (err) {
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('global-search', true, true, producto.nombre_producto);
      window.dispatchEvent(evt);
    }
  };

  return (
    <div className="buscador-wrapper" ref={wrapperRef} style={{ position: 'relative' }}>
      <div className="buscador-input-group">
        <div className="buscador-icon">
          <i className="bi bi-search"></i>
        </div>
        <Form.Control
          className="buscador-control"
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={query}
          onChange={actualizarQuery}
          onFocus={() => setAbierto(Boolean(query.trim()))}
        />
      </div>

      {abierto && sugerencias.length > 0 && (
        <div className="buscador-suggestions">
          {sugerencias.map((p) => (
            <div key={p.id_producto} className="suggestion-item" onClick={() => manejarSeleccion(p)}>
              <img className="suggestion-thumb" src={`data:image/png;base64,${p.imagen}`} alt={p.nombre_producto} />
              <div className="suggestion-meta">
                <div className="suggestion-name">{p.nombre_producto}</div>
                <div className="suggestion-sub">C$ {Number(p.precio_unitario).toFixed(2)} · Stock: {p.stock}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CuadroBusquedas;