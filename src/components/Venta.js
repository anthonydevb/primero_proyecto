import React, { useState } from 'react';
import { FiUser, FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiCheck } from 'react-icons/fi'; 
import '../components/detalles.css';

const Venta = ({ clientes, productos, addVenta }) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Función para descargar la boleta
  const descargarBoleta = async (ventaId) => {
    try {
      window.location.href = `http://localhost:4000/api/ventas/boleta/${ventaId}`;
    } catch (error) {
      console.error('Error al descargar la boleta:', error);
      alert('Hubo un problema al descargar la boleta.');
    }
  };

  const handleSelectCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setBusquedaCliente('');
  };

  const handleAddProducto = (producto) => {
    const productoExistente = productosSeleccionados.find(p => p._id === producto._id);
    
    // Si el producto ya está en el carrito, solo se actualiza su cantidad
    if (productoExistente) {
      setProductosSeleccionados(productosSeleccionados.map(p =>
        p._id === producto._id ? { ...p, cantidad: p.cantidad + cantidad } : p
      ));
    } else {
      // Si el producto no está en el carrito, se agrega
      setProductosSeleccionados([...productosSeleccionados, { ...producto, cantidad }]);
    }

    // Resetea la cantidad a 1 para el siguiente producto que se agregue
    setCantidad(1);
    setBusquedaProducto('');
  };

  const updateCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return; // No permitir cantidad menor que 1
    setProductosSeleccionados(productosSeleccionados.map(p =>
      p._id === id ? { ...p, cantidad: nuevaCantidad } : p
    ));
  };

  const removeProducto = (id) => {
    // Elimina el producto del carrito
    setProductosSeleccionados(productosSeleccionados.filter(p => p._id !== id));
  };

  const calcularTotal = () => {
    // Calcula el total sumando todos los productos en el carrito
    return productosSeleccionados.reduce(
      (total, producto) => total + (producto.precio * producto.cantidad),
      0
    ).toFixed(2);
  };

  const handleSubmitVenta = async () => {
    if (!clienteSeleccionado || productosSeleccionados.length === 0) {
      alert('Se requiere cliente y al menos un producto');
      return;
    }

    const venta = {
      cliente: clienteSeleccionado._id,
      clienteNombre: clienteSeleccionado.name,
      productos: productosSeleccionados.map(p => ({
        producto: p._id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: p.precio,
        total: (p.precio * p.cantidad).toFixed(2),
      })),
      total: calcularTotal(),
      fecha: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:4000/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venta),
      });

      const data = await response.json();

      if (response.ok) {
        setMostrarConfirmacion(true);
        addVenta(data);
        // Llama a la función para descargar la boleta después de que la venta se haya registrado
        descargarBoleta(data._id);
        
        setTimeout(() => {
          setClienteSeleccionado(null);
          setProductosSeleccionados([]);
          setMostrarConfirmacion(false);
        }, 2000);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar la venta');
    }
  };

  const handleCancelCompra = () => {
    setClienteSeleccionado(null);
    setProductosSeleccionados([]);
    setBusquedaCliente('');
    setBusquedaProducto('');
    setCantidad(1);
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.name.toLowerCase().includes(busquedaCliente.toLowerCase())
  );

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  return (
    <div className="venta-container">
      <div className="venta-header">
        <h2><FiShoppingCart /> Sistema de Ventas Premium</h2>
      </div>

      <div className="venta-grid">
        {/* Sección Cliente */}
        <div className="cliente-section">
          <div className="section-header">
            <h3><FiUser /> Selección de Cliente</h3>
          </div>
          
          {clienteSeleccionado ? (
            <div className="cliente-seleccionado-card">
              <div className="cliente-info">
                <span className="cliente-nombre">{clienteSeleccionado.name}</span>
              </div>
              <button 
                className="btn-cambiar"
                onClick={() => setClienteSeleccionado(null)}
              >
                Cambiar Cliente
              </button>
            </div>
          ) : (
            <div className="cliente-busqueda">
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
                className="search-input"
              />
              <div className="clientes-list">
                {clientesFiltrados.map(cliente => (
                  <div 
                    key={cliente._id}
                    className="cliente-item"
                    onClick={() => handleSelectCliente(cliente)}
                  >
                    {cliente.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sección Productos */}
        <div className="productos-section">
          <div className="section-header">
            <h3><FiShoppingCart /> Catálogo de Productos</h3>
          </div>
          
          <div className="productos-controls">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busquedaProducto}
              onChange={(e) => setBusquedaProducto(e.target.value)}
              className="search-input"
            />
            
            <div className="cantidad-control">
              <label>Cantidad:</label>
              <div className="cantidad-selector">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>
                  <FiMinus />
                </button>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button onClick={() => setCantidad(cantidad + 1)}>
                  <FiPlus />
                </button>
              </div>
            </div>
          </div>
          
          <div className="productos-grid">
            {productosFiltrados.map(producto => (
              <div 
                key={producto._id}
                className="producto-card"
                onClick={() => handleAddProducto(producto)}
              >
                <div className="producto-header">
                  {/* Mostrar la imagen del producto */}
                  <img 
                    src={`http://localhost:4000/uploads/${producto.imagen}`} 
                    alt={producto.nombre} 
                    className="producto-imagen"
                  />
                  <span className="producto-nombre">{producto.nombre}</span>
                  <span className="producto-precio">S/. {producto.precio.toFixed(2)}</span>
                </div>
                <div className="producto-footer">
                  <span className="producto-stock">Disponibles: {producto.stock}</span>
                  <button className="btn-agregar">
                    <FiPlus /> Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito de Compras */}
        <div className="carrito-section">
          <div className="section-header">
            <h3><FiShoppingCart /> Resumen de Venta</h3>
          </div>
          
          {productosSeleccionados.length === 0 ? (
            <div className="carrito-vacio">
              <p>No hay productos seleccionados</p>
              <small>Busque y seleccione productos del catálogo</small>
            </div>
          ) : (
            <div className="carrito-items">
              {productosSeleccionados.map(producto => (
                <div key={producto._id} className="carrito-item">
                  <div className="producto-info">
                    {/* Mostrar la imagen del producto */}
                    <img 
                      src={`http://localhost:4000/uploads/${producto.imagen}`} 
                      alt={producto.nombre} 
                      className="producto-imagen"
                    />
                    <span className="nombre">{producto.nombre}</span>
                    <span className="precio-unitario">S/. {producto.precio.toFixed(2)} c/u</span>
                  </div>
                  
                  <div className="producto-controls">
                    <div className="cantidad-control">
                      <button onClick={() => updateCantidad(producto._id, producto.cantidad - 1)}>
                        <FiMinus />
                      </button>
                      <span>{producto.cantidad}</span>
                      <button onClick={() => updateCantidad(producto._id, producto.cantidad + 1)}>
                        <FiPlus />
                      </button>
                    </div>
                    
                    <span className="producto-subtotal">
                      S/. {(producto.precio * producto.cantidad).toFixed(2)}
                    </span>
                    
                    <button 
                      className="btn-eliminar"
                      onClick={() => removeProducto(producto._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="carrito-total">
            <div className="total-info">
              <span>Subtotal:</span>
              <span>S/. {calcularTotal()}</span>
            </div>
            <div className="total-info total-final">
              <span>Total:</span>
              <span>S/. {calcularTotal()}</span>
            </div>
          </div>
          
          <button 
            className={`btn-finalizar ${mostrarConfirmacion ? 'confirmado' : ''}`}
            onClick={handleCancelCompra}
          >
            {mostrarConfirmacion ? 'Compra Finalizada' : 'Cancelar Compra'}
          </button>
          
          <button 
            className="btn-finalizar"
            onClick={handleSubmitVenta}
          >
            <FiCheck /> Confirmar Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Venta;
