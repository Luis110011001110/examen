import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Importar estilos específicos para Sidebar

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title"></h2>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            Home
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/empleados"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            Empleados
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/nomina"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/concepto_nomina"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            Conceptos de Nomina
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/puestos"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            Puestos
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/usuarios"
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            Usuarios
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;