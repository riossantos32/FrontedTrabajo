import React from "react";
import { Col, Card, Badge, Button } from 'react-bootstrap';
import { Zoom } from "react-awesome-reveal";
import './Tarjeta.css';

const Tarjeta = ({ indice, nombre_producto, descripcion_producto, precio_unitario, stock, id_categoria, imagen, opciones }) => {
  const disponible = typeof stock === 'number' ? stock > 0 : !!stock;
  const displayPrice = typeof precio_unitario === 'number' ? precio_unitario.toFixed(2) : precio_unitario;

  // simple placeholder rating when none provided
  const rating = opciones && opciones.rating ? opciones.rating : 4.3;
  const reviews = opciones && opciones.reviews ? opciones.reviews : Math.floor(Math.random() * 500) + 1;

  const renderStars = (r) => {
    const full = Math.floor(r);
    const half = r - full >= 0.5;
    const stars = [];
    for (let i = 0; i < full; i++) stars.push(<i key={i} className="bi bi-star-fill star-on" />);
    if (half) stars.push(<i key={'h'} className="bi bi-star-half star-on" />);
    while (stars.length < 5) {
      stars.push(<i key={'e' + stars.length} className="bi bi-star" />);
    }
    return stars;
  };

  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mt-3">
      <Zoom cascade triggerOnce delay={10} duration={600}>
        <Card className="product-card">
          <div className="image-wrap">
            <Card.Img
              variant="top"
              className="product-image"
              src={imagen ? `data:image/png;base64,${imagen}` : '/placeholder.png'}
            />
          </div>
          <Card.Body className="product-body">
            <Card.Title className="product-title">
              <strong>{nombre_producto}</strong>
            </Card.Title>

            <div className="meta-row">
              <div className="rating-row">
                {renderStars(rating)}
                <span className="review-count">{reviews.toLocaleString()}</span>
              </div>
              <div className="availability">
                {disponible ? <span className="available">En stock</span> : <span className="unavailable">No disponible</span>}
              </div>
            </div>

            <div className="product-desc">{descripcion_producto || 'Sin descripción'}</div>

            <div className="product-footer">
              <div className="left-group">
                <div className="price">C$   {displayPrice}</div>
                <Badge className="info-badge">
                  <i className="bi-box"></i>&nbsp;{stock}
                </Badge>
              </div>

              <div className="right-group">
                <Button size="sm" variant="outline-secondary" className="options-btn">Ver opciones</Button>
              </div>
            </div>
          </Card.Body>
          <Card.Footer className="card-note">Opciones destacadas no disponibles</Card.Footer>
        </Card>
      </Zoom>
    </Col>
  );
};

export default Tarjeta;