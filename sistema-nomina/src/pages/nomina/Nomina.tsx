import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './Nomina.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar las escalas y otros elementos necesarios
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Nomina: React.FC = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [empleadosPorPuesto, setEmpleadosPorPuesto] = useState<any[]>([]); // Empleados por puesto
  const [percepcionesPorPuesto, setPercepcionesPorPuesto] = useState<any[]>([]); // Percepciones por puesto

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('authToken');
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/reporte_empleados');
        const data = await response.json();
        setEmpleados(data);

        // Calcular el número de empleados por puesto
        const puestos = data.reduce((acc: any, empleado: any) => {
          const puesto = empleado.puesto;
          if (!acc[puesto]) {
            acc[puesto] = 0;
          }
          acc[puesto] += 1;
          return acc;
        }, {});

        // Calcular las percepciones totales por puesto
        const percepciones = data.reduce((acc: any, empleado: any) => {
          const puesto = empleado.puesto;
          if (!acc[puesto]) {
            acc[puesto] = 0;
          }
          acc[puesto] += empleado.percepciones_totales || 0; // Asegúrate de que este campo exista
          return acc;
        }, {});

        // Convertir los datos en arrays para los gráficos
        const puestosData = Object.keys(puestos).map((puesto) => ({
          puesto,
          total_empleados: puestos[puesto],
        }));

        const percepcionesData = Object.keys(percepciones).map((puesto) => ({
          puesto,
          percepciones_totales: percepciones[puesto],
        }));

        setEmpleadosPorPuesto(puestosData);
        setPercepcionesPorPuesto(percepcionesData);
      } catch (error) {
        console.error('Error al obtener los empleados:', error);
      }
    };
    fetchEmpleados();
  }, []);

  // Datos para el gráfico de número de empleados por puesto
  const empleadosPorPuestoData = {
    labels: empleadosPorPuesto.map((empleado) => empleado.puesto),
    datasets: [
      {
        label: 'Número de empleados',
        data: empleadosPorPuesto.map((empleado) => empleado.total_empleados),
        backgroundColor: '#FF9800',
      },
    ],
  };

  // Datos para el gráfico de percepciones totales por puesto
  const percepcionesPorPuestoData = {
    labels: percepcionesPorPuesto.map((empleado) => empleado.puesto),
    datasets: [
      {
        label: 'Percepciones Totales',
        data: percepcionesPorPuesto.map((empleado) => empleado.percepciones_totales),
        backgroundColor: '#4CAF50',
      },
    ],
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Nómina', 14, 10);

    const tableHeaders = [
      'Empleado ID',
      'Empleado Nombre',
      'Puesto',
      'Total Empleados',
      'Empleados por Puesto',
      'Percepciones Totales',
    ];
    const tableData = empleados.map((empleado) => [
      empleado.empleado_id,
      empleado.empleado_nombre,
      empleado.puesto,
      empleado.total_empleados,
      empleado.empleados_por_puesto,
      empleado.percepciones_totales,
    ]);

    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 20,
    });

    // Capturar el gráfico de empleados por puesto como imagen
    const chartCanvas1 = document.querySelector('#chart1') as HTMLCanvasElement;
    if (chartCanvas1) {
      const chartData1 = chartCanvas1.toDataURL('image/png');
      const finalY = (doc as any).lastAutoTable?.finalY || 20;
      doc.addImage(chartData1, 'PNG', 10, finalY + 10, 190, 100);
    }

    // Capturar el gráfico de percepciones por puesto como imagen
    const chartCanvas2 = document.querySelector('#chart2') as HTMLCanvasElement;
    if (chartCanvas2) {
      const chartData2 = chartCanvas2.toDataURL('image/png');
      const finalY2 = (doc as any).lastAutoTable?.finalY || 20;
      // Incrementar la posición Y para evitar la superposición
      doc.addImage(chartData2, 'PNG', 10, finalY2 + 110, 190, 100);
    }

    doc.save('reporte_nomina.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(empleados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'reporte_nomina.xlsx');
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="home-content">
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#FF9800' }}>Estadísticas de Nómina</h1>
          </div>
          <div style={{ padding: '20px' }}>
            <button onClick={exportToPDF} style={{ marginRight: '10px', padding: '10px' }}>
              Exportar a PDF
            </button>
            <button onClick={exportToExcel} style={{ padding: '10px' }}>
              Exportar a Excel
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Empleado ID</th>
                  <th>Empleado Nombre</th>
                  <th>Puesto</th>
                  <th>Total Empleados</th>
                  <th>Empleados por Puesto</th>
                  <th>Percepciones Totales</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((empleado) => (
                  <tr key={empleado.empleado_id}>
                    <td>{empleado.empleado_id}</td>
                    <td>{empleado.empleado_nombre}</td>
                    <td>{empleado.puesto}</td>
                    <td>{empleado.total_empleados}</td>
                    <td>{empleado.empleados_por_puesto}</td>
                    <td>{empleado.percepciones_totales ?? 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '20px' }}>
            <h2>Estadísticas de Empleados por Puesto</h2>
            <Bar id="chart1" data={empleadosPorPuestoData} options={{ responsive: true }} />
          </div>
          <div style={{ padding: '20px' }}>
            <h2>Estadísticas de Percepciones por Puesto</h2>
            <Bar id="chart2" data={percepcionesPorPuestoData} options={{ responsive: true }} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Nomina;