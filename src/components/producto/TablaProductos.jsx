// Importaciones necesarias para el componente visual
import React from 'react';

const TablaProductos = ({ productos, cargando, error, abrirModalEliminacion, abrirModalEdicion, generarPDFDetalleProducto}) => {

  if (cargando) {
    return <div>Cargando productos...</div>; // Muestra mensaje mientras carga
  }
  if (error) {
    return <div>Error: {error}</div>;        // Muestra error si ocurre
  }
  
  // Renderizado de la tabla con los datos recibidos
  return (
    <table className="productos-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-4">No hay productos que mostrar.</td>
          </tr>
        ) : (
          productos.map((producto) => (
            <tr key={producto.id_producto}>
              <td data-label="ID">{producto.id_producto}</td>
              <td data-label="Nombre">{producto.nombre_producto}</td>
              <td data-label="Descripción">{producto.descripcion_producto || 'Sin descripción'}</td>
              <td data-label="Categoría">{producto.id_categoria}</td>
              <td data-label="Precio">{
                producto.precio_unitario !== undefined && producto.precio_unitario !== null && !isNaN(Number(producto.precio_unitario))
                  ? Number(producto.precio_unitario).toFixed(2)
                  : producto.precio_unitario
              }</td>
              <td data-label="Stock">{producto.stock}</td>
              <td data-label="Imagen">
                {producto.imagen ? (
                  <img
                    src={producto.imagen.startsWith('data:') ? producto.imagen : `data:image/png;base64,${producto.imagen}`}
                    alt={producto.nombre_producto}
                  />
                ) : (
                  'Sin imagen'
                )}
              </td>
              <td className="actions-cell" data-label="Acciones">
                <button className="btn-icon btn-edit" onClick={() => abrirModalEdicion(producto)}>
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button className="btn-icon btn-delete" onClick={() => abrirModalEliminacion(producto)}>
                  <i className="bi bi-trash"></i>
                </button>
                <button className="btn-icon btn-pdf" onClick={() => generarPDFDetalleProducto(producto)}>
                  <i className="bi bi-filetype-pdf"></i>
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

// Exportación del componente
export default TablaProductos;
