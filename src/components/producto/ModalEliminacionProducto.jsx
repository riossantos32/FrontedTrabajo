import React from "react";
import './Modal.css';

const ModalEliminacionProducto = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarProducto,
}) => {
  if (!mostrarModalEliminacion) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este producto?</p>
        <div className="modal-actions">
          <button className="btn" onClick={() => setMostrarModalEliminacion(false)}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={eliminarProducto}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminacionProducto;