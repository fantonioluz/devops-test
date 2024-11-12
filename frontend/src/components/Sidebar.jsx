import React from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';



const Sidebar = () => {

  const navigate = useNavigate();

  const location = useLocation();



  // Verifica se estamos na página de login para não exibir a sidebar

  if (location.pathname === '/login') return null;



  const handleLogout = () => {

    localStorage.removeItem('token');

    navigate('/login');

  };



  return (

    <div className="flex flex-col h-full w-64 bg-gray-800 text-white fixed">

      <h2 className="text-2xl font-bold p-4 border-b border-gray-700">Painel</h2>

      <nav className="flex-grow p-4">

        <ul>

          <li className="mb-2">

            <Link to="/reservas" className="block py-2 px-4 rounded hover:bg-gray-700">

              Minhas Reservas

            </Link>

          </li>

          <li className="mb-2">

            <Link to="/salas" className="block py-2 px-4 rounded hover:bg-gray-700">

              Salas

            </Link>

          </li>

          <li className="mb-2">

            <Link to="/admin" className="block py-2 px-4 rounded hover:bg-gray-700">

              Admin

            </Link>

          </li>

        </ul>

      </nav>

      <button

        onClick={handleLogout}

        className="m-4 py-2 px-4 bg-red-600 rounded hover:bg-red-700"

      >

        Logout

      </button>

    </div>

  );

};



export default Sidebar;
