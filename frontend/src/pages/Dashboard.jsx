import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateReservation = () => {
    navigate('/reservas'); // Redireciona para a página de reservas
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <button
        onClick={handleCreateReservation}
        className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Criar Reserva
      </button>
      {/* Adicione o restante do conteúdo do Dashboard */}
    </div>
  );
};

export default Dashboard;
