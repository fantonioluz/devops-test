import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api/axiosConfig';

function ReservaCard({ reserva, onReservaChange }) {
  const [editing, setEditing] = useState(false);
  const [newDataInicio, setNewDataInicio] = useState(new Date(reserva.dataInicio));
  const [newDataFim, setNewDataFim] = useState(new Date(reserva.dataFim));

  const handleCancelReserva = async () => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/reservas/${reserva._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Reserva cancelada com sucesso!');
        onReservaChange(); // Atualiza a lista de reservas no dashboard
      } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        alert('Erro ao cancelar reserva');
      }
    }
  };

  const handleEditReserva = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/reservas/${reserva._id}`, {
        dataInicio: newDataInicio,
        dataFim: newDataFim,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Reserva atualizada com sucesso!');
      setEditing(false);
      onReservaChange(); // Atualiza a lista de reservas no dashboard
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      alert('Erro ao atualizar reserva');
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Reserva na Sala: {reserva.sala.nome}</Typography>
        <Typography>Início: {new Date(reserva.dataInicio).toLocaleString()}</Typography>
        <Typography>Fim: {new Date(reserva.dataFim).toLocaleString()}</Typography>

        {editing ? (
          <Box mt={2}>
            <DatePicker
              selected={newDataInicio}
              onChange={(date) => setNewDataInicio(date)}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Data e Hora de Início"
            />
            <DatePicker
              selected={newDataFim}
              onChange={(date) => setNewDataFim(date)}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Data e Hora de Fim"
              style={{ marginTop: '10px' }}
            />
            <Button variant="contained" color="primary" onClick={handleEditReserva} sx={{ mt: 2 }}>
              Salvar Alterações
            </Button>
            <Button variant="outlined" onClick={() => setEditing(false)} sx={{ mt: 2, ml: 1 }}>
              Cancelar
            </Button>
          </Box>
        ) : (
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => setEditing(true)}>
              Alterar Reserva
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCancelReserva} sx={{ ml: 2 }}>
              Cancelar Reserva
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default ReservaCard;
