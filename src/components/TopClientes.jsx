// src/components/TopClientes.js
import '../css/historia.css';

import React, { useEffect, useState } from 'react';

const TopClientes = () => {
  const [clientesTop, setClientesTop] = useState([]);

  // Función para obtener los top clientes
  const obtenerTopClientes = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/ventas/top-clientes'); // Asegúrate de que esta ruta exista en tu backend
      const data = await response.json();
      setClientesTop(data); // Asumiendo que la respuesta es un array con los clientes
    } catch (error) {
      console.error('Error al obtener los top clientes:', error);
    }
  };

  useEffect(() => {
    obtenerTopClientes();
  }, []);

  return (
    <div className="top-clientes">
      <h2>Top de Clientes</h2>
      <table className="tabla-clientes">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Total Gastado</th>
            <th>Ventas Realizadas</th>
          </tr>
        </thead>
        <tbody>
          {clientesTop.length === 0 ? (
            <tr>
              <td colSpan="3">No hay datos disponibles</td>
            </tr>
          ) : (
            clientesTop.map((cliente, index) => (
              <tr key={cliente._id}>
                <td>{cliente.name}</td>
                <td>S/. {cliente.totalGastado.toFixed(2)}</td>
                <td>{cliente.ventasRealizadas}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopClientes;
