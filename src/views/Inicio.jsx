import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container,Image } from "react-bootstrap";
import Portada from "../assets/portada.png"; // Importación de la imagen de portada
import Proposito from "../inicio/Proposito";

const Inicio = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navegar = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) {
      navegar("/");
    } else {
      setNombreUsuario(usuarioGuardado);
    }
  }, [navegar]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("contraseña");
    localStorage.removeItem("role");
    navegar("/");
  };

  const iraservicio= () => {
    navegar("/servicios");
  };

  return (
<Container>
<h1 className="text-center m-4">¡Bienvenido, {nombreUsuario}!</h1>
<Image className="portada-imagen" src={Portada} fluid rounded/>
<Proposito />
</Container>
);
};

export default Inicio;