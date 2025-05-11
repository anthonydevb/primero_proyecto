import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';  // Asegúrate de usar Routes, no Route dentro de Router
import ModalForm from './components/ModalForm';
import ModalProducto from './components/ModalProducto';
import Venta from './components/Venta';
import Estadisticas from './components/Estadistica'; // Asegúrate de que esta ruta sea la correcta
import './App.css';

function App() {
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);

  const handleAddCliente = () => setShowClienteModal(true);
  const handleAddProducto = () => setShowProductoModal(true);
  const handleCloseClienteModal = () => setShowClienteModal(false);
  const handleCloseProductoModal = () => setShowProductoModal(false);

  useEffect(() => {
    const fetchClientes = async () => {
      const response = await fetch('http://localhost:4000/api/clients');
      const data = await response.json();
      setClientes(data);
    };

    const fetchProductos = async () => {
      const response = await fetch('http://localhost:4000/api/products');
      const data = await response.json();
      setProductos(data);
    };

    fetchClientes();
    fetchProductos();
  }, []);

  const addVenta = (venta) => {
    setVentas((prevVentas) => [...prevVentas, venta]);
  };

  const deleteCliente = async (clienteId) => {
    const cliente = clientes.find(c => c._id === clienteId);
    const result = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: `¿Estás seguro que deseas eliminar a "${cliente.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:4000/api/clients/${clienteId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          setClientes((prevClientes) => prevClientes.filter(cliente => cliente._id !== clienteId));
          Swal.fire('Eliminado', 'El cliente fue eliminado correctamente.', 'success');
        } else {
          const data = await response.json();
          Swal.fire('Error', `Error al eliminar cliente: ${data.message}`, 'error');
        }
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        Swal.fire('Error', 'Hubo un error al eliminar el cliente.', 'error');
      }
    }
  };

  const deleteProducto = async (productoId) => {
    const producto = productos.find(p => p._id === productoId);
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Estás seguro que deseas eliminar el producto "${producto.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:4000/api/products/${productoId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          setProductos((prevProductos) => prevProductos.filter(producto => producto._id !== productoId));
          Swal.fire('Eliminado', 'El producto fue eliminado correctamente.', 'success');
        } else {
          const data = await response.json();
          Swal.fire('Error', `Error al eliminar producto: ${data.message}`, 'error');
        }
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        Swal.fire('Error', 'Hubo un error al eliminar el producto.', 'error');
      }
    }
  };

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="header-left">
            <h1 className="logo-title">Tienda</h1>
          </div>
          <div className="header-right">
            {/* Corregido el enlace a /estadisticas */}
            <Link to="/estadisticas" className="stats-link">Estadísticas</Link>
          </div>
        </header>

        <div className="main-content">
          <Routes>
            <Route path="/" element={
              <div>
                <h2>Clientes y Productos</h2>
                {/* Sección Clientes */}
                <div className="section cliente-section">
                  <div className="section-header">
                    <h2 className="section-title">Clientes</h2>
                    <button className="button" onClick={handleAddCliente}>
                      <span className="plus-icon">+</span>
                    </button>
                  </div>

                  <div className="clientes-list">
                    {clientes.map((cliente) => (
                      <div className="cliente-item" key={cliente._id}>
                        <span>{cliente.name}</span>
                        <div className="cliente-actions">
                          <button className="edit-button"></button>
                          <button className="delete-button" onClick={() => deleteCliente(cliente._id)}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sección Productos */}
                <div className="section producto-section">
                  <div className="section-header">
                    <h2 className="section-title">Productos</h2>
                    <button className="button" onClick={handleAddProducto}>
                      <span className="plus-icon">+</span>
                    </button>
                  </div>

                  <div className="productos-list">
                    {productos.map((producto) => (
                      <div className="producto-item" key={producto._id}>
                        <div className="producto-info">
                          <span className="producto-nombre">{producto.nombre}</span>
                          <div className="producto-detalles">
                            <span><strong>Precio:</strong> ${producto.precio}</span>
                            <span><strong>Stock:</strong> {producto.stock}</span>
                          </div>

                          {producto.imagen && (
                            <img
                              src={`http://localhost:4000/uploads/${producto.imagen}`}
                              alt={producto.nombre}
                              className="producto-lis"
                              style={{
                                width: '20px',
                                height: '10px',
                                objectFit: 'cover',
                                marginTop: '8px',
                                borderRadius: '8px',
                                boxShadow: '0 0 5px rgba(0,0,0,0.2)'
                              }}
                            />
                          )}
                        </div>

                        <div className="producto-actions">
                          <button className="edit-button"></button>
                          <button className="delete-button" onClick={() => deleteProducto(producto._id)}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sección Ventas */}
                <div className="ventas-section">
                  <h2 className="section-title">Registro de Ventas</h2>
                  <Venta clientes={clientes} productos={productos} addVenta={addVenta} />

                  {ventas.length > 0 && (
                    <div className="ventas-table-container">
                      <table className="ventas-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Productos</th>
                            <th>Total</th>
                            <th>Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ventas.map((venta, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{venta.cliente}</td>
                              <td>{venta.productos.map(p => `${p.nombre} (${p.cantidad})`).join(', ')}</td>
                              <td>${venta.total}</td>
                              <td>{new Date().toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            } />
            <Route path="/estadisticas" element={<Estadisticas />} />
          </Routes>
        </div>

        {/* Modales */}
        {showClienteModal && (
          <ModalForm
            addCliente={(cliente) => setClientes((prevClientes) => [...prevClientes, cliente])}
            closeModal={handleCloseClienteModal}
          />
        )}

        {showProductoModal && (
          <ModalProducto
            addProducto={(producto) => setProductos((prevProductos) => [...prevProductos, producto])}
            closeModal={handleCloseProductoModal}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
