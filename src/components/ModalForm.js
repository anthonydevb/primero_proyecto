import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalForm = ({ addCliente, closeModal }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('DNI');
  const [documento, setDocumento] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificamos que todos los campos estén completos
    if (!nombre || !telefono || !correo || !documento) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const data = {
      name: nombre,
      phone: telefono,
      email: correo,
      tipoDocumento: tipoDocumento,
      documento: documento,
    };

    try {
      const response = await fetch('http://localhost:4000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        addCliente(result); // Llamar a addCliente recibido como prop
        closeModal(); // Cerrar el modal
      } else {
        alert('Error al agregar el cliente: ' + result.message);
      }
    } catch (error) {
      alert('Error al enviar los datos: ' + error.message);
    }

    // Limpiar campos después de enviar
    setNombre('');
    setTelefono('');
    setCorreo('');
    setTipoDocumento('DNI');
    setDocumento('');
  };

  return (
    <Modal show={true} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del Cliente"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="telefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="correo">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="tipoDocumento">
            <Form.Label>Tipo de Documento</Form.Label>
            <Form.Control
              as="select"
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              required
            >
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="documento">
            <Form.Label>Documento</Form.Label>
            <Form.Control
              type="text"
              placeholder="Número de Documento"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Agregar Cliente
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalForm;
