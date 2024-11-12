import React, { useEffect, useState } from 'react';
import SalaList from '../components/SalaList';
import api from '../api/axiosConfig';

const ReservasPage = () => {
  const [salas, setSalas] = useState([]);

  useEffect(() => {
    const fetchSalas = async () => {
      const response = await api.get('/salas');
      setSalas(response.data);
    };

    fetchSalas();
  }, []);

  return (
    <div className="p-6">
      <SalaList salas={salas} />
    </div>
  );
};

export default ReservasPage;
