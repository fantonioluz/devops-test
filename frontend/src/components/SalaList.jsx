import React, { useState } from 'react';
import HorarioSala from './HorarioSala';

const SalaList = ({ salas }) => {
  const [selectedSala, setSelectedSala] = useState(null);

  const handleSalaClick = (sala) => {
    setSelectedSala(sala);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Salas Disponíveis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {salas.map((sala) => (
          <div
            key={sala.id}
            onClick={() => handleSalaClick(sala)}
            className="bg-white p-4 rounded shadow-md cursor-pointer hover:bg-gray-100 transition"
          >
            <h2 className="text-xl font-semibold">{sala.nome}</h2>
            <p>Capacidade: {sala.capacidade}</p>
          </div>
        ))}
      </div>
      {selectedSala && (
        <div className="mt-8">
          <HorarioSala sala={selectedSala} />
        </div>
      )}
    </div>
  );
};

export default SalaList;
