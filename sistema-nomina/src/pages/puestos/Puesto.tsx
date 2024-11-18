import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import '../../components/Header.css';
import '../../components/Home.css';
import '../../components/Sidebar.css';

interface Puesto {
  id: number;
  nombre: string;
  sueldo_base: number;
  f_alta: string;
}

const Puestos: React.FC = () => {
  const navigate = useNavigate();
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPuesto, setNewPuesto] = useState({ nombre: '', sueldo_base: 0 });

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('authToken');
    if (!isAuthenticated) {
      navigate('/');
    }

    const fetchPuestos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/puestos');
        const data = await response.json();
        setPuestos(data);
      } catch (error) {
        console.error('Error al obtener los puestos:', error);
      }
    };

    fetchPuestos();
  }, [navigate]);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openViewModal = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => setIsViewModalOpen(false);

  const openEditModal = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleAddPuesto = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/puestos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPuesto),
      });

      if (response.ok) {
        const createdPuesto = await response.json();
        setPuestos([...puestos, createdPuesto]);
        closeAddModal();
      } else {
        alert('Error al agregar el puesto');
      }
    } catch (error) {
      console.error('Error al agregar el puesto:', error);
    }
  };

  const handleEditPuesto = async () => {
    if (!selectedPuesto) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/puestos/${selectedPuesto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedPuesto),
      });

      if (response.ok) {
        const updatedPuesto = await response.json();
        setPuestos(puestos.map((puesto) => (puesto.id === updatedPuesto.id ? updatedPuesto : puesto)));
        closeEditModal();
      } else {
        alert('Error al editar el puesto');
      }
    } catch (error) {
      console.error('Error al editar el puesto:', error);
    }
  };

  const handleDeletePuesto = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/puestos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPuestos(puestos.filter((puesto) => puesto.id !== id));
        alert('Puesto eliminado correctamente');
      } else {
        alert('Error al eliminar el puesto');
      }
    } catch (error) {
      console.error('Error al eliminar el puesto:', error);
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="home-content">
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#009688' }}>Sección: Puestos</h1>
            <button
              onClick={openAddModal}
              style={{ ...buttonStyles, marginBottom: '20px', backgroundColor: '#4CAF50' }}
            >
              Agregar Puesto
            </button>
          </div>

          <table className="puestos-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Sueldo Base</th>
                <th>Fecha de Alta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {puestos.map((puesto) => (
                <tr key={puesto.id}>
                  <td>{puesto.id}</td>
                  <td>{puesto.nombre}</td>
                  <td>{puesto.sueldo_base}</td>
                  <td>{new Date(puesto.f_alta).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => openViewModal(puesto)} style={buttonStyles}>
                        Ver
                      </button>
                      <button onClick={() => openEditModal(puesto)} style={buttonStyles}>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletePuesto(puesto.id)}
                        style={{ ...buttonStyles, backgroundColor: '#f44336' }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>

      {/* Modal Agregar */}
      {isAddModalOpen && (
        <div className="modal-overlay" style={modalOverlayStyles}>
          <div className="modal" style={modalStyles}>
            <h2>Agregar Puesto</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={newPuesto.nombre}
              onChange={(e) => setNewPuesto({ ...newPuesto, nombre: e.target.value })}
              style={inputStyles}
            />
            <input
              type="number"
              placeholder="Sueldo Base"
              value={newPuesto.sueldo_base}
              onChange={(e) => setNewPuesto({ ...newPuesto, sueldo_base: parseFloat(e.target.value) })}
              style={inputStyles}
            />
            <div>
              <button onClick={handleAddPuesto} style={buttonStyles}>
                Guardar
              </button>
              <button onClick={closeAddModal} style={buttonStyles}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver */}
      {isViewModalOpen && selectedPuesto && (
        <div className="modal-overlay" style={modalOverlayStyles}>
          <div className="modal" style={modalStyles}>
            <h2>Detalles del Puesto</h2>
            <p><strong>ID:</strong> {selectedPuesto.id}</p>
            <p><strong>Nombre:</strong> {selectedPuesto.nombre}</p>
            <p><strong>Sueldo Base:</strong> ${selectedPuesto.sueldo_base}</p>
            <button onClick={closeViewModal} style={buttonStyles}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {isEditModalOpen && selectedPuesto && (
        <div className="modal-overlay" style={modalOverlayStyles}>
          <div className="modal" style={modalStyles}>
            <h2>Editar Puesto</h2>
            <input
              type="text"
              value={selectedPuesto.nombre}
              onChange={(e) =>
                setSelectedPuesto({ ...selectedPuesto, nombre: e.target.value })
              }
              style={inputStyles}
            />
            <input
              type="number"
              value={selectedPuesto.sueldo_base}
              onChange={(e) =>
                setSelectedPuesto({ ...selectedPuesto, sueldo_base: parseFloat(e.target.value) })
              }
              style={inputStyles}
            />
            <div>
              <button onClick={handleEditPuesto} style={buttonStyles}>
                Guardar Cambios
              </button>
              <button onClick={closeEditModal} style={buttonStyles}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyles = {
  position: 'fixed' as 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const modalStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '400px',
  width: '100%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const inputStyles = {
  width: '100%',
  padding: '8px',
  margin: '10px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyles = {
  padding: '10px 15px',
  margin: '5px',
  backgroundColor: '#009688',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default Puestos;