import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalProducto = ({ closeModal, addProducto }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState(''); // Nuevo estado para el campo stock

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificamos que todos los campos estén completos
    if (!nombre || !precio || !descripcion || !stock || parseInt(stock) < 1) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const data = { nombre, precio, descripcion, stock: parseInt(stock) }; // Incluimos el stock en los datos

    try {
      const response = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const nuevoProducto = await response.json(); // El producto creado desde la API

        // Pasamos el producto recién creado al estado de App
        addProducto(nuevoProducto);

        alert('Producto agregado');
        closeModal(); // Cerrar el modal
      } else {
        alert('Error al agregar el producto');
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }

    // Limpiar campos
    setNombre('');
    setPrecio('');
    setDescripcion('');
    setStock(''); // Limpiar el campo de stock
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
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Descripción del Producto"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </Form.Group>

          {/* Nuevo campo para el stock */}
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

          <Button variant="primary" type="submit">
            Agregar Producto
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalProducto;
