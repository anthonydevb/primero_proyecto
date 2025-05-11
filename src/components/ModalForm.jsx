import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const ModalForm = ({ addCliente, closeModal }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('DNI');
  const [documento, setDocumento] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const soloNumeros = /^[0-9]+$/;

    if (!nombre || !telefono || !correo || !documento) {
      return Swal.fire('Campos incompletos', 'Completa todos los campos', 'warning');
    }

    if (!soloLetras.test(nombre)) {
      return Swal.fire('Nombre inválido', 'El nombre solo debe contener letras', 'error');
    }

    if (!soloNumeros.test(telefono) || telefono.length !== 9) {
      return Swal.fire('Teléfono inválido', 'El teléfono debe tener 9 dígitos numéricos', 'error');
    }

    if (!soloNumeros.test(documento)) {
      return Swal.fire('Documento inválido', 'El documento debe contener solo números', 'error');
    }

    if (
      (tipoDocumento === 'DNI' && documento.length !== 8) ||
      (tipoDocumento === 'RUC' && documento.length !== 11)
    ) {
      return Swal.fire(
        'Documento inválido',
        `El ${tipoDocumento} debe tener ${tipoDocumento === 'DNI' ? 8 : 11} dígitos`,
        'error'
      );
    }

    const data = {
      name: nombre,
      phone: telefono,
      email: correo,
      tipoDocumento,
      documento,
    };

    try {
      const response = await fetch('http://localhost:4000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire('Cliente agregado', 'El cliente se registró correctamente', 'success');
        addCliente(result);
        closeModal();
      } else {
        Swal.fire('Error', result.message || 'Error al agregar el cliente', 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Error al enviar los datos', 'error');
    }

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
              maxLength={9}
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
              maxLength={tipoDocumento === 'DNI' ? 8 : 11}
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
