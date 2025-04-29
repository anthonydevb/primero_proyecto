import React, { useState, useEffect } from 'react';
import ModalForm from './components/ModalForm';
import ModalProducto from './components/ModalProducto';
import Venta from './components/Venta';
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
    setVentas([...ventas, venta]);
  };

  const deleteCliente = async (clienteId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/clients/${clienteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setClientes(clientes.filter(cliente => cliente._id !== clienteId));
        alert('Cliente eliminado exitosamente');
      } else {
        const data = await response.json();
        alert(`Error al eliminar cliente: ${data.message}`);
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      alert('Hubo un error al eliminar el cliente. Intenta nuevamente.');
    }
  };

  const deleteProducto = async (productoId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${productoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setProductos(productos.filter(producto => producto._id !== productoId));
        alert('Producto eliminado exitosamente');
      } else {
        const data = await response.json();
        alert(`Error al eliminar producto: ${data.message}`);
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Hubo un error al eliminar el producto. Intenta nuevamente.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Tienda</h1>
      </header>

      <div className="main-content">
        <div className="top-sections">
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
                    <button className="edit-button">✏️</button>
                    <button 
                      className="delete-button" 
                      onClick={() => deleteCliente(cliente._id)}
                    >
                      🗑️
                    </button>
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
                  </div>
                  <div className="producto-actions">
                    <button className="edit-button">✏️</button>
                    <button 
                      className="delete-button" 
                      onClick={() => deleteProducto(producto._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección Ventas (debajo) */}
        <div className="ventas-section">
          <h2 className="section-title">Registro de Ventas</h2>
          <Venta clientes={clientes} productos={productos} addVenta={addVenta} />
          
          {/* Tabla de ventas */}
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
                      <td>
                        {venta.productos.map(p => `${p.nombre} (${p.cantidad})`).join(', ')}
                      </td>
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

      {/* Modales */}
      {showClienteModal && (
        <ModalForm
          addCliente={(cliente) => setClientes([...clientes, cliente])}
          closeModal={handleCloseClienteModal}
        />
      )}

      {showProductoModal && (
        <ModalProducto
          addProducto={(producto) => setProductos([...productos, producto])}
          closeModal={handleCloseProductoModal}
        />
      )}
    </div>
  );
}

export default App;