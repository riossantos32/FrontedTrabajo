import React from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./LoginForm.css";
import portada from "../../assets/logo_lunaSeda.jpg";

const LoginForm = ({ email, password, error, setEmail, setPassword, manejarEnvio }) => {
  return (
    <div className="login-container">
      <div className="login-panel">
        <div className="login-left">
          <h1>Bienvenid@ !</h1>
          <p className="lead">Explora una gran varienda de productos con la app Luna & Seda.</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="login-form">
            <Form onSubmit={manejarEnvio}>
              <Form.Group className="mb-3" controlId="usuario">
                <Form.Control
                  className="rounded-input"
                  type="text"
                  placeholder="Usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="contraseñaUsuario">
                <Form.Control
                  className="rounded-input"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" className="login-btn w-100">Ingresar</Button>
            </Form>

            <div className="divider-row">o continuar con</div>

            <div className="social-row">
              <div className="social-circle">G</div>
              <div className="social-circle">
                <a href="https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Ftse4.explicit.bing.net%2Fth%2Fid%2FOIP.6x6s1sTIRrU8my_FCLwPqwHaFj%3Fpid%3DApi&sp=1763487607T0f4a256da62122fee963727ed2e0e3b3c3ae93968116d9faf5527ff8efd7d31b" target="_blank" rel="noopener noreferrer">
                </a>
                </div>
              <div className="social-circle">f</div>
            </div>

            <div style={{ marginTop: 18, color: '#6b7280' }}>
              No soy miembro? <a href="#">Registerse</a>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="right-card">
            <img src={portada} alt="Portada" className="right-image" />
            <h3>Visualiza tus prodcutos preferidos</h3>
            <p style={{color:'#6b7280'}}>con la aplicación Luna & Seda</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;