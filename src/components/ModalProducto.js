import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ModalProducto = ({ closeModal, addProducto }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Expresiones regulares
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const soloNumeros = /^[0-9]+(\.[0-9]{1,2})?$/;

    if (!nombre || !precio || !descripcion || !stock || !categoria || !imagen) {
      return Swal.fire('Campos incompletos', 'Completa todos los campos y selecciona una imagen.', 'warning');
    }

    if (!soloLetras.test(nombre)) {
      return Swal.fire('Nombre inválido', 'El nombre solo debe contener letras', 'error');
    }

    if (!soloNumeros.test(precio) || parseFloat(precio) <= 0) {
      return Swal.fire('Precio inválido', 'El precio debe ser un número positivo', 'error');
    }

    if (!soloLetras.test(descripcion)) {
      return Swal.fire('Descripción inválida', 'La descripción solo debe contener letras', 'error');
    }

    if (!soloNumeros.test(stock) || parseInt(stock) < 1) {
      return Swal.fire('Stock inválido', 'El stock debe ser un número mayor a 0', 'error');
    }

    if (!soloLetras.test(categoria)) {
      return Swal.fire('Categoría inválida', 'La categoría solo debe contener letras', 'error');
    }

    try {
      const categoriaId = await guardarOCrearCategoria(categoria);

      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('precio', precio);
      formData.append('descripcion', descripcion);
      formData.append('stock', stock);
      formData.append('categoria', categoriaId);
      formData.append('imagen', imagen);

      const resProducto = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        body: formData,
      });

      if (resProducto.ok) {
        const nuevoProducto = await resProducto.json();
        addProducto(nuevoProducto);
        Swal.fire('Producto agregado', 'Se registró correctamente', 'success');
        closeModal();
      } else {
        Swal.fire('Error', 'No se pudo agregar el producto', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Ocurrió un problema al guardar el producto', 'error');
    }

    setNombre('');
    setPrecio('');
    setDescripcion('');
    setStock('');
    setCategoria('');
    setImagen(null);
  };

  const guardarOCrearCategoria = async (nombreCategoria) => {
    try {
      const res = await fetch('http://localhost:4000/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoria: nombreCategoria }),
      });

      if (!res.ok) throw new Error('Error al crear categoría');

      const categoriaGuardada = await res.json();
      return categoriaGuardada._id;
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      Swal.fire('Error', 'No se pudo guardar la categoría', 'error');
    }
  };

  return (
    <Modal show={true} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del Producto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="precio">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              placeholder="Precio"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              placeholder="Descripción del Producto"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="stock">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Cantidad en Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="categoria">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre de la categoría"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="imagen">
            <Form.Label>Imagen del Producto</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImagen(e.target.files[0])}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Agregar Producto
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalProducto;
