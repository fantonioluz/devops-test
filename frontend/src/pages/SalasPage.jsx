import React, { useState } from 'react';
import { Container, Typography, TextField, Box } from '@mui/material';
import api from '../api/axiosConfig';
import SalaCard from '../components/SalaCard';
import CustomButton from '../components/CustomButton';

function SalasPage() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [salasDisponiveis, setSalasDisponiveis] = useState([]);

  const buscarSalasDisponiveis = async () => {
    try {
      const response = await api.get('/salas/disponiveis', {
        params: { dataInicio, dataFim },
      });
      setSalasDisponiveis(response.data);
    } catch (error) {
      console.error("Erro ao buscar salas disponíveis", error);
    }
  };

  const reservarSala = async (salaId) => {
    try {
      await api.post('/reservas', { salaId, dataInicio, dataFim });
      alert("Sala reservada com sucesso!");
    } catch (error) {
      console.error("Erro ao reservar sala", error);
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4">Salas Disponíveis</Typography>
        <TextField
          label="Data e Hora de Início"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Data e Hora de Fim"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <CustomButton color="primary" onClick={buscarSalasDisponiveis}>
          Buscar Salas
        </CustomButton>
        <Box mt={2}>
          {salasDisponiveis.map((sala) => (
            <SalaCard key={sala._id} sala={sala} onReserve={reservarSala} />
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default SalasPage;
