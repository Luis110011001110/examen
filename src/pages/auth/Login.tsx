import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login: React.FC = () => {
  const [correo, setCorreo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({
    nombre_usuario: '',
    correo: '',
    rol: 'usuario', // Valor predeterminado 'usuario'
    password: '',
    empleado_id: 0, // Valor predeterminado para empleado_id
  });
  const navigate = useNavigate();

  // Manejo del login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/auth', { correo, password });
      const { token, username } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
      window.location.reload();
      navigate('/home');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          if (err.response.status === 404) {
            setError('Usuario no encontrado');
          } else if (err.response.status === 401) {
            setError('Contraseña incorrecta');
          } else {
            setError('Error en el servidor');
          }
        } else {
          setError('Error al conectar con el servidor');
        }
      } else {
        setError('Error desconocido');
      }
    }
  };

  // Toggle para mostrar/ocultar el modal de registro
  const handleModalToggle = () => {
    setShowModal(!showModal);
    setError(null); // Limpiar mensajes de error cuando se abre/cierra el modal
  };

  // Manejo del registro de usuario
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Enviar los datos de nuevo usuario al servidor
      const response = await axios.post('http://127.0.0.1:8000/api/v1/usuarios', newUser);

      if (response.data.success) {
        // Si el registro fue exitoso, mostrar mensaje de éxito, redirigir y recargar
        alert('Usuario registrado exitosamente.');
        setShowModal(false);
        window.location.href = '/login';

      } else {
        throw new Error('No se pudo guardar el usuario');
      }
    } catch (err) {
      // Mostrar mensaje de error en caso de fallo
      setError('Error al registrar el usuario. Intenta nuevamente.');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="correo">Correo Electrónico:</label>
          <input
            type="email"
            id="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
      <button onClick={handleModalToggle}>¿No tienes cuenta? Regístrate</button>

      {/* Modal de Registro */}
      <div className={`modal ${showModal ? 'show' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={handleModalToggle}>×</span>
          <h3>Registrar nuevo usuario</h3>
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label htmlFor="nombre_usuario">Nombre de usuario:</label>
              <input
                type="text"
                id="nombre_usuario"
                value={newUser.nombre_usuario}
                onChange={(e) => setNewUser({ ...newUser, nombre_usuario: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newCorreo">Correo Electrónico:</label>
              <input
                type="email"
                id="newCorreo"
                value={newUser.correo}
                onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Contraseña:</label>
              <input
                type="password"
                id="newPassword"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="rol">Rol:</label>
              <select
                id="rol"
                value={newUser.rol}
                onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;