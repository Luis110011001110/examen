import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';  // Ruta al componente Login
import Home from './pages/home/Home';  // Ruta al componente Home
import Empleados from './pages/empleados/EmpleadoList';  // Ruta a la sección de Empleados
import Nomina from './pages/nomina/Nomina';  // Ruta a la sección de Nómina
import ConceptoNomina from './pages/concepto_nomina/Concepto';  // Ruta a la sección de Nómina
import Puestos from './pages/puestos/Puesto';  // Ruta a la sección de Puestos
import Usuarios from './pages/usuarios/UserList';  // Ruta a la sección de Usuarios
import Sidebar from './components/Sidebar';  // Ruta al componente Sidebar
import './App.css';
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);  // Establecer el estado de autenticación
  }, []);
  return (
    <Router>
      <div className="app-container">
        {/* Mostrar el Sidebar solo si el usuario está autenticado */}
        {isAuthenticated && <Sidebar />}
        
        <div className="content-container">
          <Routes>
            {/* Si el usuario no está autenticado, mostrar Login, si está autenticado, redirigir a /Home */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/Home" /> : <Login />} />

            {/* Página protegida - Home, solo accesible si el usuario está autenticado */}
            <Route path="/Home" element={isAuthenticated ? (<Home /> ) : (<Navigate to="/" />) }
            />
            <Route
              path="/empleados" element={isAuthenticated ? (<Empleados /> ) : (<Navigate to="/" />) }
            />
            <Route path="/nomina" element={isAuthenticated ? (<Nomina />) : (<Navigate to="/" /> ) }
            />
            <Route path="/concepto_nomina"element={  isAuthenticated ? (<ConceptoNomina /> ) : ( <Navigate to="/" /> )}
            />

            <Route
              path="/puestos"
              element={
                isAuthenticated ? (
                  <Puestos />  // Aquí se carga el componente Puestos
                ) : (
                  <Navigate to="/" />  // Redirige a Login si no está autenticado
                )
              }
            />

            <Route
              path="/usuarios"
              element={
                isAuthenticated ? (
                  <Usuarios />  // Aquí se carga el componente Usuarios
                ) : (
                  <Navigate to="/" />  // Redirige a Login si no está autenticado
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;