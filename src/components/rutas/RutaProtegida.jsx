import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ vista, roleRequired }) => {
  const estaLogueado = !!localStorage.getItem('usuario') && !!localStorage.getItem('contraseña');

  if (!estaLogueado) {
    return <Navigate to="/" replace />;
  }

  if (roleRequired === 'administrador') {
    const role = localStorage.getItem('role');
    if (role !== 'administrador') {
      return <Navigate to="/" replace />;
    }
  }

  return vista;
};

export default RutaProtegida;