import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header'; // Importar el Header
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer'; // Importar el Footer
import '../../components/Header.css'; // Importar estilos del Header
import '../../components/Home.css'; // (Opcional) Crear un CSS para estilos específicos de Home
import '../../components/Sidebar.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('authToken');

    if (!isAuthenticated) {
      navigate('/'); // Redirige a la página de login si no está autenticado
    }
  }, [navigate]);

  const username = localStorage.getItem('username') || 'Usuario'; // Obtener el nombre de usuario

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
          <h1>Bienvenido!</h1>
          <p>Estás autenticado y listo para empezar a usar el sistema de nómina.</p>

        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;