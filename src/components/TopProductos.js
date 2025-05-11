// src/components/TopProductos.js
import '../css/historia.css';

import React, { useEffect, useState } from 'react';

const TopProductos = () => {
  const [productosTop, setProductosTop] = useState([]);

  // Función para obtener los productos más vendidos
  const obtenerTopProductos = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/ventas/top-productos'); // Asegúrate de que esta ruta exista en tu backend
      const data = await response.json();
      setProductosTop(data); // Asumiendo que la respuesta es un array con los productos
    } catch (error) {
      console.error('Error al obtener los productos más vendidos:', error);
    }
  };

  useEffect(() => {
    obtenerTopProductos();
  }, []);

  return (
    <div className="top-productos">
      <h2>Top de Productos Más Vendidos</h2>
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad Vendida</th>
            <th>Total Vendido</th>
          </tr>
        </thead>
        <tbody>
          {productosTop.length === 0 ? (
            <tr>
              <td colSpan="3">No hay datos disponibles</td>
            </tr>
          ) : (
            productosTop.map((producto, index) => (
              <tr key={producto._id}>
                <td>{producto.nombre}</td>
                <td>{producto.cantidadVendida}</td>
                <td>S/. {producto.totalVendido.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopProductos;
