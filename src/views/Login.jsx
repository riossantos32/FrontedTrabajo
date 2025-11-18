import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/login/LoginForm";
import "../app.css";
import "../components/login/LoginForm.css"; // Importar el CSS para el fondo

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);

  const navegar = useNavigate();

  const manejarEnvio = async (e)  => {
    e.preventDefault();

    try {
      const respuesta = await fetch("https://backend-aiven-4.onrender.com/api/verificar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: nombreUsuario, contraseña }),
      });

      const datos = await respuesta.json();

      if (datos && datos.usuario) {
        console.log("Usuario verificado correctamente", datos);
        localStorage.setItem("usuario", nombreUsuario);
        localStorage.setItem("contraseña", contraseña);
        // Guardar role si viene del backend (por compatibilidad, 'usuario' por defecto)
        const role = datos.role ? datos.role : 'usuario';
        localStorage.setItem("role", role);
        // Redirigir según role: usuario -> catálogo, administrador -> gestión de productos
        if (role === 'administrador') {
          navegar('/productos');
        } else {
          navegar('/CatalogoProductos');
        }
      } else {
        setError(datos && datos.mensaje ? datos.mensaje : "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
      console.error("Error en la solicitud:", error);
    }
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      navegar("/inicio");
    }
  }, [navegar]);

  return (
    <div className="login-container">
      <LoginForm
        email={nombreUsuario}
        password={contraseña}
        error={error}
        setEmail={setNombreUsuario}
        setPassword={setContraseña}
        manejarEnvio={manejarEnvio}
      />
    </div>
  );
};

export default Login;