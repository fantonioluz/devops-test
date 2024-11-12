import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api/axiosConfig';

const HorarioSala = ({ sala }) => {
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());

  const handleStartDateChange = (date) => {
    setStartDateTime(date);
  };

  const handleEndDateChange = (date) => {
    setEndDateTime(date);
  };

  const handleReservation = async () => {
    console.log('Sala ID:', sala.id); // Verifique se o ID da sala está correto
    try {
      await api.post('/reservas', {
        salaId: sala.id, // Confirme que estamos passando `salaId`
        dataInicio: startDateTime.toISOString(),
        dataFim: endDateTime.toISOString(),
      });
      alert(`Reserva feita para a sala ${sala.nome} de ${startDateTime.toLocaleString()} até ${endDateTime.toLocaleString()}`);
    } catch (error) {
      console.error('Erro ao fazer a reserva:', error);
      alert('Erro ao fazer a reserva');
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Horários para {sala.nome}</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Data e hora de início:</label>
        <DatePicker
          selected={startDateTime}
          onChange={handleStartDateChange}
          showTimeSelect
          dateFormat="Pp"
          className="mt-2 w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Data e hora de término:</label>
        <DatePicker
          selected={endDateTime}
          onChange={handleEndDateChange}
          showTimeSelect
          dateFormat="Pp"
          className="mt-2 w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        onClick={handleReservation}
        className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Reservar
      </button>
    </div>
  );
};

export default HorarioSala;
