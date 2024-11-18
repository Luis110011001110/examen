import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaSignOutAlt } from 'react-icons/fa';  
import './Header.css'; 

const Header: React.FC = () => {
  const navigate = useNavigate();  // Inicializar navigate para redirigir

  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Eliminar el token de autenticación
    localStorage.removeItem('username');   // Eliminar el nombre de usuario
    navigate('/');  // Redirigir al login
    window.location.reload();
  };

  return (
    <header className="header">
      <nav>
        <ul>  
          <li>
            <button onClick={handleLogout} aria-label="Cerrar sesión">
              <FaSignOutAlt size={24} />  {/* Ícono de salida */}
            </button>
          </li>  
        </ul>
      </nav>
    </header>
  );
}

export default Header;