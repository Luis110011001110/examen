import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header'; // Importar el Header
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer'; // Importar el Footer
import '../../components/Header.css'; // Importar estilos del Header
import '../../components/Home.css'; // (Opcional) Crear un CSS para estilos específicos de Home
import '../../components/Sidebar.css';
import axios from 'axios'; // Importar axios para hacer las peticiones HTTP

const ConceptosNomina: React.FC = () => {
  const navigate = useNavigate();
  const [conceptos, setConceptos] = useState<any[]>([]); // Estado para almacenar los datos
  const [loading, setLoading] = useState<boolean>(true); // Estado para gestionar la carga de datos
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const [selectedConcepto, setSelectedConcepto] = useState<any | null>(null); // Estado para el concepto seleccionado
  const [showModalVer, setShowModalVer] = useState<boolean>(false); // Estado para mostrar el modal de ver
  const [showModalEditar, setShowModalEditar] = useState<boolean>(false); // Estado para mostrar el modal de editar

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('authToken');

    if (!isAuthenticated) {
      navigate('/'); // Redirige a la página de login si no está autenticado
    }
  }, [navigate]);

  // Obtener el nombre de usuario
  const username = localStorage.getItem('username') || 'Usuario'; 

  // Función para obtener los conceptos de nómina desde la API
  useEffect(() => {
    const fetchConceptos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/conceptos_nomina', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setConceptos(response.data); // Guardar los datos en el estado
      } catch (err) {
        setError('Error al obtener los conceptos de nómina');
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchConceptos();
  }, []);

  // Función para manejar la acción de ver
  const handleVer = (concepto: any) => {
    setSelectedConcepto(concepto);
    setShowModalVer(true); // Mostrar el modal de ver
  };

  // Función para manejar la acción de editar
  const handleEditar = (concepto: any) => {
    setSelectedConcepto(concepto);
    setShowModalEditar(true); // Mostrar el modal de editar
  };

  // Función para manejar la acción de eliminar
  const handleEliminar = async (concepto: any) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/conceptos_nomina/${concepto.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setConceptos(conceptos.filter((c) => c.id !== concepto.id)); // Eliminar el concepto de la lista
    } catch (err) {
      setError('Error al eliminar el concepto');
    }
  };

  // Función para manejar la acción de agregar nuevo concepto
  const handleAgregar = () => {
    navigate('/agregar-concepto'); // Navegar a la página para agregar un nuevo concepto
  };

  // Cerrar los modales
  const handleCloseModal = () => {
    setShowModalVer(false);
    setShowModalEditar(false);
    setSelectedConcepto(null); // Limpiar el concepto seleccionado
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal con margen para el Sidebar */}
      <div className="main-content">
        {/* Header */}
        <Header />

        {/* Contenido principal */}
        <div className="home-content">
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#4CAF50' }}>Sección: Conceptos de Nómina</h1>
            <button onClick={handleAgregar} style={addButtonStyle}>Agregar Concepto</button>
          </div>

          {/* Mostrar los conceptos de nómina o un mensaje de carga */}
          {loading ? (
            <p>Cargando conceptos de nómina...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div>
              <h2>Lista de Conceptos de Nómina</h2>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Importe</th>
                    <th>Fecha de Alta</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {conceptos.map((concepto: any) => (
                    <tr key={concepto.id}>
                      <td>{concepto.nombre}</td>
                      <td>{concepto.tipo}</td>
                      <td>${concepto.importe.toLocaleString()}</td> {/* Mostrar el importe con formato */}
                      <td>{new Date(concepto.f_alta).toLocaleDateString()}</td> {/* Formatear la fecha */}
                      <td>
                        <div style={actionButtonContainerStyle}>
                          <button onClick={() => handleVer(concepto)} style={actionButtonStyle}>
                            <i className="fas fa-eye"></i> Ver
                          </button>
                          <button onClick={() => handleEditar(concepto)} style={actionButtonStyle}>
                            <i className="fas fa-edit"></i> Editar
                          </button>
                          <button onClick={() => handleEliminar(concepto)} style={actionButtonStyle}>
                            <i className="fas fa-trash"></i> Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Modal de Ver */}
      {showModalVer && selectedConcepto && (
        <div style={overlayStyle}>
          <div style={modalContentStyle}>
            <h2>Detalles del Concepto</h2>
            <p><strong>Nombre:</strong> {selectedConcepto.nombre}</p>
            <p><strong>Tipo:</strong> {selectedConcepto.tipo}</p>
            <p><strong>Importe:</strong> ${selectedConcepto.importe.toLocaleString()}</p>
            <p><strong>Fecha de Alta:</strong> {new Date(selectedConcepto.f_alta).toLocaleDateString()}</p>
            <button onClick={handleCloseModal} style={modalCloseButtonStyle}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de Editar */}
      {showModalEditar && selectedConcepto && (
        <div style={overlayStyle}>
          <div style={modalContentStyle}>
            <h2>Editar Concepto</h2>
            <form>
              <div>
                <label>Nombre:</label>
                <input type="text" defaultValue={selectedConcepto.nombre} />
              </div>
              <div>
                <label>Tipo:</label>
                <input type="text" defaultValue={selectedConcepto.tipo} />
              </div>
              <div>
                <label>Importe:</label>
                <input type="number" defaultValue={selectedConcepto.importe} />
              </div>
              <div>
                <label>Fecha de Alta:</label>
                <input type="date" defaultValue={selectedConcepto.f_alta.split('T')[0]} />
              </div>
              <button type="submit">Guardar</button>
              <button type="button" onClick={handleCloseModal} style={modalCloseButtonStyle}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos con tipo React.CSSProperties

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'gray',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  maxWidth: '90%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  overflowY: 'auto',
  maxHeight: '80vh',
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

const addButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#008CBA',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginBottom: '20px',
};

const actionButtonContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',  // Asegura que los botones estén alineados verticalmente en el centro
  justifyContent: 'flex-start', // Opcional, alinea los botones hacia la izquierda
  gap: '10px', // Espacio entre los botones
};

const actionButtonStyle: React.CSSProperties = {
  padding: '8px 15px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

export default ConceptosNomina;