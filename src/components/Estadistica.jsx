import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import '../css/esta.css';

const Estadistica = ({ icon, label, value }) => {
  return (
    <div className="estadistica-card">
      <div className="estadistica-icon">{icon}</div>
      <div className="estadistica-info">
        <p className="estadistica-label">{label}</p>
        <p className="estadistica-value">{value}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: ''
  });

  const [datosVentas, setDatosVentas] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const ventasRes = await axios.get('http://localhost:4000/api/ventas', {
          params: filters,
        });

        console.log('Datos de ventas:', ventasRes.data.ventas);
        console.log('Productos más vendidos:', ventasRes.data.productosMasVendidos);

        setDatosVentas(ventasRes.data.ventas);
        setProductosMasVendidos(ventasRes.data.productosMasVendidos); // Establecemos los productos más vendidos
        setTotalVentas(ventasRes.data.totalVentas); // Establecemos el total de ventas
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const ingresosTotales = totalVentas * 1.15;

  const totalVentasFormatted = totalVentas > 0 ? `S/${totalVentas.toLocaleString()}` : 'S/0';
  const ingresosTotalesFormatted = ingresosTotales > 0 ? `S/${ingresosTotales.toLocaleString()}` : 'S/0';
  const totalProductosFormatted = datosVentas.reduce((sum, item) => sum + (item.productos ? item.productos.length : 0), 0);
  const promedioVentas = totalVentas > 0 && datosVentas.length > 0 ? Math.round(totalVentas / datosVentas.length).toLocaleString() : '0';

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>Dashboard de Ventas</h1>
        <div className="loading">Cargando datos, por favor espera...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard de Ventas</h1>

      <div className="filtros-section">
        <h2>Filtros</h2>
        <div className="filtros-grid">
          <div className="filtro-item">
            <label>Fecha Inicio:</label>
            <input type="date" name="fechaInicio" value={filters.fechaInicio} onChange={handleFilterChange} />
          </div>
          <div className="filtro-item">
            <label>Fecha Fin:</label>
            <input type="date" name="fechaFin" value={filters.fechaFin} onChange={handleFilterChange} />
          </div>
        </div>
      </div>

      <div className="estadisticas-section">
        <h2>Resumen General</h2>
        <div className="estadisticas-grid">
          <Estadistica icon="💰" label="Total de Ventas" value={totalVentasFormatted} />
          <Estadistica icon="📈" label="Ingresos Totales" value={ingresosTotalesFormatted} />
          <Estadistica icon="🛒" label="Productos Vendidos" value={totalProductosFormatted} />
          <Estadistica icon="📊" label="Promedio de Ventas por Producto" value={`S/${promedioVentas}`} />
        </div>
      </div>

      <div className="graficos-section">
        <div className="grafico-container">
          <h3>Ventas por Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosVentas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis tickFormatter={(value) => `S/${value.toLocaleString()}`} />
              <Tooltip formatter={(value) => `S/${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="ventas" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grafico-container">
          <h3>Productos Más Vendidos</h3>
          {productosMasVendidos.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productosMasVendidos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div>No hay datos para mostrar</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
