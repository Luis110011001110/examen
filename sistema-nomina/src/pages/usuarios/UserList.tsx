import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header'; // Importar el Header
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer'; // Importar el Footer
import '../../components/Header.css'; // Importar estilos del Header
import '../../components/Home.css'; // (Opcional) Crear un CSS para estilos específicos de Home
import '../../components/Sidebar.css';
import axios from 'axios'; // Necesitarás axios para hacer las peticiones HTTP

const Usuarios: React.FC = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<any[]>([]); // Estado para los usuarios
  const [selectedUser, setSelectedUser] = useState<any>(null); // Estado para el usuario seleccionado
  const [modalAction, setModalAction] = useState<string>(''); // Acción de modal: 'ver', 'editar' o 'eliminar'
  const [isDeleting, setIsDeleting] = useState<boolean>(false); // Estado para saber si se está eliminando

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('authToken');

    if (!isAuthenticated) {
      navigate('/'); // Redirige a la página de login si no está autenticado
    }
  }, [navigate]);

  const username = localStorage.getItem('username') || 'Usuario'; // Obtener el nombre de usuario

  // Realizar la solicitud para obtener los usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/usuarios');
        setUsuarios(response.data); // Asignar los usuarios al estado
      } catch (error) {
        console.error('Error al obtener los usuarios', error);
      }
    };

    fetchUsuarios();
  }, []);

  // Funciones para manejar las acciones del modal
  const openModal = (action: string, user: any) => {
    setModalAction(action);
    setSelectedUser(user);
  };

  const closeModal = () => {
    setModalAction('');
    setSelectedUser(null);
  };

  // Función para eliminar un usuario
  const handleDelete = async () => {
    if (selectedUser) {
      try {
        setIsDeleting(true);
        await axios.delete(`http://127.0.0.1:8000/api/v1/usuarios/${selectedUser.id}`);
        setUsuarios(usuarios.filter((user) => user.id !== selectedUser.id)); // Eliminar el usuario de la lista
        setIsDeleting(false);
        closeModal(); // Cerrar el modal después de eliminar
      } catch (error) {
        console.error('Error al eliminar el usuario', error);
        setIsDeleting(false);
      }
    }
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
            <h1 style={{ color: '#673AB7' }}>Sección: Usuarios</h1>
            <p>Estás en la sección donde puedes gestionar la información de los usuarios.</p>
          </div>

          {/* Tabla de usuarios */}
          <table className="table" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Fecha de Alta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre_usuario}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.rol}</td>
                  <td>{new Date(usuario.f_alta).toLocaleString()}</td>
                  <td>
                    <button onClick={() => openModal('ver', usuario)} style={{ marginRight: '10px' }}>
                      Ver
                    </button>
                    <button onClick={() => openModal('editar', usuario)} style={{ marginRight: '10px' }}>
                      Editar
                    </button>
                    <button onClick={() => openModal('eliminar', usuario)} style={{ backgroundColor: 'red', color: 'white' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal para "Ver" */}
          {modalAction === 'ver' && selectedUser && (
            <div className="modal" style={{ display: 'block', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-content" style={{ backgroundColor: 'gray', padding: '20px', margin: '15% auto', width: '80%' }}>
                <h2>Ver Usuario</h2>
                <p><strong>Nombre de Usuario:</strong> {selectedUser.nombre_usuario}</p>
                <p><strong>Correo:</strong> {selectedUser.correo}</p>
                <p><strong>Rol:</strong> {selectedUser.rol}</p>
                <p><strong>Fecha de Alta:</strong> {new Date(selectedUser.f_alta).toLocaleString()}</p>
                <button onClick={closeModal}>Cerrar</button>
              </div>
            </div>
          )}

          {/* Modal para "Editar" */}
          {modalAction === 'editar' && selectedUser && (
            <div className="modal" style={{ display: 'block', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-content" style={{ backgroundColor: 'gray', padding: '20px', margin: '15% auto', width: '80%' }}>
                <h2>Editar Usuario</h2>
                {/* Aquí podrías agregar un formulario para editar los datos del usuario */}
                <form>
                  <label>
                    Nombre de Usuario:
                    <input type="text" defaultValue={selectedUser.nombre_usuario} />
                  </label>
                  <br />
                  <label>
                    Correo:
                    <input type="email" defaultValue={selectedUser.correo} />
                  </label>
                  <br />
                  <label>
                    Rol:
                    <input type="text" defaultValue={selectedUser.rol} />
                  </label>
                  <br />
                  <button type="submit">Guardar cambios</button>
                </form>
                <button onClick={closeModal}>Cerrar</button>
              </div>
            </div>
          )}

          {/* Modal para "Eliminar" */}
          {modalAction === 'eliminar' && selectedUser && (
            <div className="modal" style={{ display: 'block', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="modal-content" style={{ backgroundColor: 'gray', padding: '20px', margin: '15% auto', width: '80%' }}>
                <h2>¿Estás seguro de que deseas eliminar este usuario?</h2>
                <p><strong>Nombre de Usuario:</strong> {selectedUser.nombre_usuario}</p>
                <p><strong>Correo:</strong> {selectedUser.correo}</p>
                <button onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </button>
                <button onClick={closeModal}>Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Usuarios;