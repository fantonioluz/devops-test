import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import api from '../api/axiosConfig';

function ReservasPage() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await api.get('/reservas/usuario');
        setReservas(response.data);
      } catch (error) {
        console.error("Erro ao buscar reservas", error);
      }
    };
    fetchReservas();
  }, []);

  const cancelarReserva = async (id) => {
    try {
      await api.delete(`/reservas/${id}`);
      setReservas(reservas.filter(reserva => reserva._id !== id));
    } catch (error) {
      console.error("Erro ao cancelar reserva", error);
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4">Minhas Reservas</Typography>
        <List>
          {reservas.map((reserva) => (
            <ListItem key={reserva._id} divider>
              <ListItemText primary={`Sala: ${reserva.sala.nome}`} secondary={`Data: ${new Date(reserva.dataInicio).toLocaleString()} - ${new Date(reserva.dataFim).toLocaleString()}`} />
              <Button variant="contained" color="secondary" onClick={() => cancelarReserva(reserva._id)}>
                Cancelar
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default ReservasPage
