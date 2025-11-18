  import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./PiePagina.css";

const PiePagina = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-copyright">
          <p>Luna & Seda, {new Date().getFullYear()}. ©</p>
        </div>
        <div className="footer-links">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <i className="bi bi-facebook"></i> Facebook
          </a>
          <a
            href="https://wa.me/+5058664491"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <i className="bi bi-whatsapp"></i> Soporte técnico
          </a>
        </div>
      </div>
    </footer>
  );
};

export default PiePagina;