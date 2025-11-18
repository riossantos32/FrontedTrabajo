import React, { useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import Tarjeta from '../components/catalogo/Tarjeta';

const CatalogoProductos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [productosFiltradas, setProductosFiltradas] = useState([]);

  // Obtener productos
  const obtenerProductos = async () => {
    try {
      const respuesta = await fetch('https://backend-aiven-4.onrender.com/api/productos');
      if (!respuesta.ok) throw new Error('Error al cargar los productos');
      const datos = await respuesta.json();
      setListaProductos(datos);
      setProductosFiltradas(datos);
      setCargando(false);
    } catch (error) {
      setErrorCarga(error.message);
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  useEffect(() => {
    const manejarBusquedaGlobal = (e) => {
      const texto = (e && e.detail) ? String(e.detail).toLowerCase() : '';
      if (!texto) {
        setProductosFiltradas(listaProductos);
        return;
      }

      const filtradas = listaProductos.filter((producto) =>
        (producto.nombre_producto || '').toLowerCase().includes(texto) ||
        (producto.descripcion_producto || '').toLowerCase().includes(texto)
      );
      setProductosFiltradas(filtradas);
    };

    window.addEventListener('global-search', manejarBusquedaGlobal);
    return () => window.removeEventListener('global-search', manejarBusquedaGlobal);
  }, [listaProductos]);

  if (cargando) return <div>Cargando...</div>;
  if (errorCarga) return <div>Error: {errorCarga}</div>;

  return (
    <Container className="mt-5">
      <br></br>
      <h4>Catálogo de Productos</h4>
      <Row className="g-4 mt-3">
        {productosFiltradas.map((producto, indice) => (
          <Tarjeta
            key={producto.id_producto}
            indice={indice}
            nombre_producto={producto.nombre_producto}
            descripcion_producto={producto.descripcion_producto}
            precio_unitario={producto.precio_unitario}
            stock={producto.stock}
            id_categoria={producto.id_categoria}
            imagen={producto.imagen}
          />
        ))}
      </Row>
    </Container>
  );
};

export default CatalogoProductos;