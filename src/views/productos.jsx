import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/producto/TablaProductos';
import ModalRegistroProducto from '../components/producto/ModalRegistroProducto';
import ModalActualizacionProducto from '../components/producto/ModalActualizacionProducto';
import ModalEliminacionProducto from '../components/producto/ModalEliminacionProducto';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import './productos.css';
import { Card, Row, Col } from 'react-bootstrap';
import Paginacion from '../components/ordenamiento/Paginacion';

const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5; // Número de elementos por página
  const [productosFiltradas, setProductosFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    id_categoria: '',
    precio_unitario: '',
    stock: '',
    imagen: ''
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  const columnas = ["ID", "Nombre", "Descripción", "Categoría", "Precio", "Stock"];
  const filas = productosFiltradas.map((producto) => [
    producto.id_producto,
    producto.nombre_producto,
    producto.descripcion_producto,
    producto.id_categoria,
    `C$ ${producto.precio_unitario}`,
    producto.stock,
  ]);

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

  // Obtener categorías para el dropdown
  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('https://backend-aiven-4.onrender.com/api/categoria');
      if (!respuesta.ok) throw new Error('Error al cargar las categorías');
      const datos = await respuesta.json();
      setListaCategorias(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoAEditar(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const eliminarProducto = async () => {
    if (!productoAEliminar) return;

    try {
      const respuesta = await fetch(`https://backend-aiven-4.onrender.com/api/eliminarproducto/${productoAEliminar.id_producto}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el producto');
      }

      await obtenerProductos();
      setMostrarModalEliminacion(false);
      setProductoAEliminar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  const abrirModalEdicion = (producto) => {
    setProductoAEditar(producto);
    setMostrarModalEdicion(true);
  };

    const agregarProducto = async () => {
      if (!nuevoProducto.nombre_producto || !nuevoProducto.id_categoria ||
        !nuevoProducto.precio_unitario || !nuevoProducto.stock) {
        setErrorCarga("Por favor, completa todos los campos requeridos.");
        return;
      }

      try {
        const respuesta = await fetch('https://backend-aiven-4.onrender.com/api/registrarproducto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoProducto),  
        });

        if (!respuesta.ok) throw new Error('Error al agregar el producto');

        await obtenerProductos();
        setNuevoProducto({
          nombre_producto: '',
          descripcion_producto: '',
          id_categoria: '',
          precio_unitario: '',
          stock: '',
          imagen: ''
        });
        setMostrarModal(false);
        setErrorCarga(null);
      } catch (error) {
        setErrorCarga(error.message);
      }
    };

  const actualizarProducto = async () => {
    if (!productoAEditar) return;

    try {
      const respuesta = await fetch(`https://backend-aiven-4.onrender.com/api/actualizarproducto/${productoAEditar.id_producto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoAEditar),
      });

      if (!respuesta.ok) {
        throw new Error('Error al actualizar el producto');
      }

      await obtenerProductos();
      setMostrarModalEdicion(false);
      setProductoAEditar(null);
      setErrorCarga(null);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Calcular elementos paginados
  const productosPaginadas = productosFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );


  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);

    const filtradas = listaProductos.filter(
      (producto) =>
        producto.nombre_producto.toLowerCase().includes(texto) ||
        producto.descripcion_producto.toLowerCase().includes(texto)
    );
    setProductosFiltradas(filtradas);
  };


  const generarPDFProductos = () => {
    const doc = new jsPDF();
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("Lista de Productos", doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 20, left: 14, right: 14 },
      tableWidth: "auto",
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
      },
      pageBreak: "auto",
      rowPageBreak: "auto",
      didDrawPage: function (data) {
        const alturaPagina = doc.internal.pageSize.getHeight();
        const anchoPagina = doc.internal.pageSize.getWidth();
        const numeroPagina = doc.internal.getNumberOfPages();

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        const piePagina = `Página ${numeroPagina} de {total_pages}`;
        doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
      },
    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages("{total_pages}");
    }

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `productos_${dia}${mes}${anio}.pdf`;

    doc.save(nombreArchivo);
  };

  const generarPDFDetalleProducto = (producto) => {
    const pdf = new jsPDF();
    const anchoPagina = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(28, 41, 51);
    pdf.rect(0, 20, anchoPagina, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.text(producto.nombre_producto, anchoPagina / 2, 38, { align: "center" });

    let posicionY = 50;

    if (producto.imagen) {
      const propiedadesImagen = pdf.getImageProperties(producto.imagen);
      const anchoImagen = 100;
      const altoImagen = (propiedadesImagen.height * anchoImagen) / propiedadesImagen.width;
      const posicionX = (anchoPagina - anchoImagen) / 2;

      pdf.addImage(producto.imagen, "JPEG", posicionX, 40, anchoImagen, altoImagen);
      posicionY = 40 + altoImagen + 10;
    }

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);

    const offsetY = 10;

    pdf.text(`Descripción: ${producto.descripcion_producto}`, anchoPagina / 2, posicionY + offsetY, { align: "center" });
    pdf.text(`Categoría: ${producto.id_categoria}`, anchoPagina / 2, posicionY + 2 * offsetY, { align: "center" });
    pdf.text(`Precio: C$ ${producto.precio_unitario}`, anchoPagina / 2, posicionY + 3 * offsetY, { align: "center" });
    pdf.text(`Stock: ${producto.stock}`, anchoPagina / 2, posicionY + 4 * offsetY, { align: "center" });

    pdf.save(`${producto.nombre_producto}.pdf`);
  };

  const exportarExcelProductos = () => {
    const datos = productosFiltrados.map((producto) => ({
      ID: producto.id_producto,
      Nombre: producto.nombre_producto,
      Descripcion: producto.descripcion_producto,
      Id_Categoria: producto.id_categoria,
      Precio: parseFloat(producto.precio_unitario),
      Stock: producto.stock
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    const nombreArchivo = `Productos_${dia}${mes}${anio}.xlsx`;

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
  }

  return (
    <div className="productos-container">
      <Card className="productos-card">
        <Card.Body>
          <div className="productos-header">
            <h4 className="m-0">Productos</h4>
          </div>

          <div className="productos-actions-row mt-3 d-flex align-items-center justify-content-center gap-2">
            <div className="productos-count">Total: {listaProductos.length}</div>
            <button
              className="icon-btn btn-primary"
              onClick={() => setMostrarModal(true)}
              title="Nuevo Producto"
              aria-label="Nuevo Producto"
            >
              <i className="bi bi-plus-lg"></i>
            </button>
            <button
              className="icon-btn btn-danger"
              onClick={generarPDFProductos}
              title="Generar PDF"
              aria-label="Generar PDF"
            >
              <i className="bi bi-file-earmark-pdf"></i>
            </button>
            <button
              className="icon-btn btn-success"
              onClick={exportarExcelProductos}
              title="Generar Excel"
              aria-label="Generar Excel"
            >
              <i className="bi bi-file-earmark-spreadsheet"></i>
            </button>
          </div>

          <Row className="my-3">
            <Col md={8} sm={12}>
              <CuadroBusquedas
                textoBusqueda={textoBusqueda}
                manejarCambioBusqueda={manejarCambioBusqueda}
              />
            </Col>
          </Row>

          <TablaProductos
            productos={productosPaginadas}
            cargando={cargando}
            error={errorCarga}
            abrirModalEdicion={abrirModalEdicion}
            abrirModalEliminacion={abrirModalEliminacion}
            generarPDFDetalleProducto={generarPDFDetalleProducto}
          />

          <Paginacion
            elementosPorPagina={elementosPorPagina}
            totalElementos={listaProductos.length}
            paginaActual={paginaActual}
            establecerPaginaActual={establecerPaginaActual}
          />
        </Card.Body>
      </Card>

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejarCambioInput={manejarCambioInput}
        agregarProducto={agregarProducto}
        errorCarga={errorCarga}
        categorias={listaCategorias}
        imagenFile={imagenFile}
        setImagenFile={setImagenFile}
      />

      {productoAEditar && (
        <ModalActualizacionProducto
          mostrarModal={mostrarModalEdicion}
          setMostrarModal={setMostrarModalEdicion}
          productoAEditar={productoAEditar}
          manejarCambioInput={manejarCambioInputEdicion}
          actualizarProducto={actualizarProducto}
          errorCarga={errorCarga}
          categorias={listaCategorias}
        />
      )}

      <ModalEliminacionProducto
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarProducto={eliminarProducto}
      />
    </div>
  );
};

export default Productos;