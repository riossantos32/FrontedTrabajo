import React from 'react';
import { Form } from 'react-bootstrap';
import './Modal.css';

const ModalActualizacionProducto = ({
  mostrarModal,
  setMostrarModal,
  productoAEditar,
  manejarCambioInput,
  actualizarProducto,
  errorCarga,
  categorias
}) => {
  if (!mostrarModal) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarProducto();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        <button className="modal-close" aria-label="Cerrar" onClick={() => setMostrarModal(false)}>&times;</button>
        <h2>Editar Producto</h2>
        {errorCarga && <div className="error-mensaje">{errorCarga}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre_producto">Nombre</label>
              <input
                id="nombre_producto"
                type="text"
                name="nombre_producto"
                value={productoAEditar?.nombre_producto || ''}
                onChange={manejarCambioInput}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="id_categoria">Categoría</label>
              <select
                id="id_categoria"
                name="id_categoria"
                value={productoAEditar?.id_categoria || ''}
                onChange={manejarCambioInput}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias?.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="precio_unitario">Precio Unitario</label>
              <input
                id="precio_unitario"
                type="number"
                step="0.01"
                min="0"
                name="precio_unitario"
                value={productoAEditar?.precio_unitario ?? ''}
                onChange={manejarCambioInput}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                type="number"
                min="0"
                name="stock"
                value={productoAEditar?.stock ?? ''}
                onChange={manejarCambioInput}
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="descripcion_producto">Descripción</label>
              <textarea
                id="descripcion_producto"
                name="descripcion_producto"
                value={productoAEditar?.descripcion_producto || ''}
                onChange={manejarCambioInput}
              />
            </div>

            <Form.Group className="mb-3" controlId="formImagenProducto">
  <Form.Label>Imagen</Form.Label>
  <Form.Control
    type="file"
    name="imagen"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          manejarCambioInput({
            target: { name: 'imagen', value: reader.result.split(',')[1] } // Extrae solo la parte Base64
          });
        };
        reader.readAsDataURL(file);
      }
    }}
  />
</Form.Group>

            <div className="form-group preview-group">
              <label>Vista previa</label>
              {productoAEditar?.imagen ? (
                <img className="preview-image" src={productoAEditar.imagen.startsWith('data:') ? productoAEditar.imagen : `data:image/png;base64,${productoAEditar.imagen}`} alt={productoAEditar?.nombre_producto || 'Imagen producto'} />
              ) : (
                <div className="no-preview">Sin imagen</div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Actualizar</button>
            <button type="button" className="btn" onClick={() => setMostrarModal(false)}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalActualizacionProducto;
