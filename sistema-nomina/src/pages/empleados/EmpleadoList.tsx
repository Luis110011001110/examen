import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import '../../components/Header.css';
import '../../components/Home.css';
import '../../components/Sidebar.css';
import axios from 'axios';
import { FaEdit, FaEye, FaTrashAlt, FaPlus } from 'react-icons/fa'; // Iconos
import * as XLSX from 'xlsx'; // Para Excel
import { jsPDF } from 'jspdf'; // Para PDF
import 'jspdf-autotable'; // Para tablas en PDF

// Estilos para el modal
const modalBackgroundStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'gray',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '100%',
};

const modalCloseButtonStyle: React.CSSProperties = {
  marginTop: '10px',
  padding: '10px 15px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '5px',
};

// Modal para ver o editar un empleado
const Modal: React.FC<{ title: string, content: any, onClose: () => void }> = ({ title, content, onClose }) => {
  return (
    <div style={modalBackgroundStyle}>
      <div style={modalContentStyle}>
        <h2>{title}</h2>
        <div>{content}</div>
        <button onClick={onClose} style={modalCloseButtonStyle}>Cerrar</button>
      </div>
    </div>
  );
};

const Empleados: React.FC = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<any[]>([]); // Estado para almacenar la lista de empleados
  const [loading, setLoading] = useState<boolean>(true); // Estado para manejar la carga
  const [selectedEmpleado, setSelectedEmpleado] = useState<any>(null); // Empleado seleccionado
  const [modalType, setModalType] = useState<'edit' | 'view' | 'create' | null>(null); // Tipo de modal (crear, editar o ver)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Estado para manejar la visibilidad del modal
  const [formData, setFormData] = useState({
    nombre: '',
    region: '',
    puesto_id: 0,
    estado: 'activo',
  }); // Formulario de creación/edición

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmpleado(null);
    setFormData({
      nombre: '',
      region: '',
      puesto_id: 0,
      estado: 'activo',
    });
  };

  // Función para manejar los cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('authToken');

    if (!isAuthenticated) {
      navigate('/'); // Redirige a la página de login si no está autenticado
    } else {
      // Hacer la petición a la API para obtener la lista de empleados
      axios.get('http://127.0.0.1:8000/api/v1/empleados', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Enviar token de autenticación si es necesario
        }
      })
      .then((response) => {
        setEmpleados(response.data); // Guardar la lista de empleados en el estado
        setLoading(false); // Cambiar el estado de carga a false
      })
      .catch((error) => {
        console.error("Error al obtener los empleados:", error);
        setLoading(false); // Cambiar el estado de carga a false en caso de error
      });
    }
  }, [navigate]);

  const handleEdit = (empleado: any) => {
    setSelectedEmpleado(empleado);
    setFormData({
      nombre: empleado.nombre,
      region: empleado.region,
      puesto_id: empleado.puesto_id,
      estado: empleado.estado,
    });
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleView = (empleado: any) => {
    setSelectedEmpleado(empleado);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleDelete = (empleadoId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      axios.delete(`http://127.0.0.1:8000/api/v1/empleados/${empleadoId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      .then(() => {
        setEmpleados(empleados.filter(emp => emp.id !== empleadoId)); // Eliminar empleado de la lista
      })
      .catch((error) => {
        console.error("Error al eliminar el empleado:", error);
      });
    }
  };

  const handleCreate = () => {
    setModalType('create');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'create') {
      axios.post('http://127.0.0.1:8000/api/v1/empleados', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      .then((response) => {
        setEmpleados([...empleados, response.data]); // Agregar el nuevo empleado a la lista
        closeModal();
      })
      .catch((error) => {
        console.error("Error al crear el empleado:", error);
      });
    } else if (modalType === 'edit' && selectedEmpleado) {
      axios.put(`http://127.0.0.1:8000/api/v1/empleados/${selectedEmpleado.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      .then(() => {
        setEmpleados(empleados.map(emp => emp.id === selectedEmpleado.id ? { ...emp, ...formData } : emp)); // Actualizar la lista de empleados
        closeModal();
      })
      .catch((error) => {
        console.error("Error al actualizar el empleado:", error);
      });
    }
  };

  const generateExcelReport = () => {
    const activeEmployees = empleados.filter(emp => emp.estado === 'activo');
    const ws = XLSX.utils.json_to_sheet(activeEmployees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Empleados Activos');
    XLSX.writeFile(wb, 'empleados_activos.xlsx');
  };

  const generatePdfReport = () => {
    const activeEmployees = empleados.filter(emp => emp.estado === 'activo');
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.text('Reporte de Empleados Activos', 14, 10);

    const data = activeEmployees.map(emp => [
      emp.id,
      emp.nombre,
      emp.puesto?.nombre,
      emp.estado,
      new Date(emp.f_alta).toLocaleDateString()
    ]);

    doc.autoTable({
      head: [['ID', 'Nombre', 'Puesto', 'Estado', 'Fecha Alta']],
      body: data,
      startY: 20,
      styles: { fontSize: 10, cellPadding: 2 },
    });

    doc.save('empleados_activos.pdf');
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="home-content">
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#2196F3' }}>Sección: Empleados</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <button
                onClick={handleCreate}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  width: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                <FaPlus style={{ marginRight: '8px' }} />
                Crear Empleado
              </button>
              <button
                onClick={generateExcelReport}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#FFEB3B',
                  color: 'black',
                  border: 'none',
                  cursor: 'pointer',
                  width: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                Exportar Excel
              </button>
              <button
                onClick={generatePdfReport}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  width: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                Exportar PDF
              </button>
            </div>

            {loading ? (
              <p>Cargando empleados...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Región</th>
                    <th>Puesto</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empleados.map((empleado) => (
                    <tr key={empleado.id}>
                      <td>{empleado.id}</td>
                      <td>{empleado.nombre}</td>
                      <td>{empleado.region}</td>
                      <td>{empleado.puesto?.nombre}</td>
                      <td>{empleado.estado}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button onClick={() => handleView(empleado)} style={{ cursor: 'pointer' }}>
                            <FaEye />
                          </button>
                          <button onClick={() => handleEdit(empleado)} style={{ cursor: 'pointer' }}>
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(empleado.id)} style={{ cursor: 'pointer' }}>
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <Footer />
      </div>

      {isModalOpen && (
        <Modal
          title={modalType === 'create' ? 'Crear Empleado' : modalType === 'edit' ? 'Editar Empleado' : 'Ver Empleado'}
          content={
            <div>
              {modalType !== 'view' && (
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Región:</label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Puesto:</label>
                    <input
                      type="number"
                      name="puesto_id"
                      value={formData.puesto_id}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Estado:</label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                  <button type="submit">Guardar</button>
                </form>
              )}
              {modalType === 'view' && selectedEmpleado && (
                <div>
                  <p><strong>Nombre:</strong> {selectedEmpleado.nombre}</p>
                  <p><strong>Región:</strong> {selectedEmpleado.region}</p>
                  <p><strong>Puesto:</strong> {selectedEmpleado.puesto?.nombre}</p>
                  <p><strong>Estado:</strong> {selectedEmpleado.estado}</p>
                  <p><strong>Fecha de Alta:</strong> {new Date(selectedEmpleado.f_alta).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          }
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Empleados;