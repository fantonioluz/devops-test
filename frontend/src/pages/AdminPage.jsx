import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, TextField, Modal } from '@mui/material';
import api from '../api/axiosConfig';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSala, setEditSala] = useState(null);
  const [editReserva, setEditReserva] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const usersResponse = await api.get('/auth/usuarios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reservasResponse = await api.get('/reservas', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const salasResponse = await api.get('/salas', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data);
        setReservas(reservasResponse.data);
        setSalas(salasResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados do administrador:', error);
      }
    };
    fetchData();
  }, []);

  // Funções CRUD para Salas
  const handleCreateSala = async () => {
    const nome = prompt('Nome da Sala');
    const capacidade = prompt('Capacidade da Sala');
    if (nome && capacidade) {
      try {
        const token = localStorage.getItem('token');
        await api.post('/salas', { nome, capacidade }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Sala criada com sucesso!');
        window.location.reload(); // Recarrega para atualizar a lista de salas
      } catch (error) {
        console.error('Erro ao criar sala:', error);
        alert('Erro ao criar sala');
      }
    }
  };

  const handleEditSala = async (sala) => {
    const nome = prompt('Novo Nome da Sala', sala.nome);
    const capacidade = prompt('Nova Capacidade da Sala', sala.capacidade);
    if (nome && capacidade) {
      try {
        const token = localStorage.getItem('token');
        await api.put(`/salas/${sala._id}`, { nome, capacidade }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Sala atualizada com sucesso!');
        window.location.reload();
      } catch (error) {
        console.error('Erro ao atualizar sala:', error);
        alert('Erro ao atualizar sala');
      }
    }
  };

  const handleDeleteSala = async (salaId) => {
    if (window.confirm('Tem certeza que deseja excluir essa sala?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/salas/${salaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Sala excluída com sucesso!');
        window.location.reload();
      } catch (error) {
        console.error('Erro ao excluir sala:', error);
        alert('Erro ao excluir sala');
      }
    }
  };

  // Funções CRUD para Reservas
  const handleCreateReserva = async () => {
    const salaId = prompt('ID da Sala para Reserva');
    const dataInicio = prompt('Data e Hora de Início (formato ISO)');
    const dataFim = prompt('Data e Hora de Fim (formato ISO)');
    if (salaId && dataInicio && dataFim) {
      try {
        const token = localStorage.getItem('token');
        await api.post('/reservas', { salaId, dataInicio, dataFim }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Reserva criada com sucesso!');
        window.location.reload();
      } catch (error) {
        console.error('Erro ao criar reserva:', error);
        alert('Erro ao criar reserva');
      }
    }
  };

  const handleEditReserva = async (reserva) => {
    const dataInicio = prompt('Nova Data e Hora de Início (formato ISO)', reserva.dataInicio);
    const dataFim = prompt('Nova Data e Hora de Fim (formato ISO)', reserva.dataFim);
    if (dataInicio && dataFim) {
      try {
        const token = localStorage.getItem('token');
        await api.put(`/reservas/${reserva._id}`, { dataInicio, dataFim }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Reserva atualizada com sucesso!');
        window.location.reload();
      } catch (error) {
        console.error('Erro ao atualizar reserva:', error);
        alert('Erro ao atualizar reserva');
      }
    }
  };

  const handleDeleteReserva = async (reservaId) => {
    if (window.confirm('Tem certeza que deseja cancelar essa reserva?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/reservas/${reservaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Reserva cancelada com sucesso!');
        window.location.reload();
      } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        alert('Erro ao cancelar reserva');
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4">Painel do Administrador</Typography>

      {/* Seção de Usuários */}
      <Box mt={4}>
        <Typography variant="h5">Usuários</Typography>
        {users.map((user) => (
          <Box key={user._id} mt={2}>
            <Typography>{user.name} ({user.email}) - Role: {user.role}</Typography>
          </Box>
        ))}
      </Box>

      {/* Seção de Salas */}
      <Box mt={4}>
        <Typography variant="h5">Salas</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateSala}>
          Criar Nova Sala
        </Button>
        {salas.map((sala) => (
          <Box key={sala._id} mt={2}>
            <Typography>{sala.nome} - Capacidade: {sala.capacidade}</Typography>
            <Button color="primary" onClick={() => handleEditSala(sala)}>Editar</Button>
            <Button color="secondary" onClick={() => handleDeleteSala(sala._id)}>Excluir</Button>
          </Box>
        ))}
      </Box>

      {/* Seção de Reservas */}
      <Box mt={4}>
        <Typography variant="h5">Reservas</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateReserva}>
          Criar Nova Reserva
        </Button>
        {reservas.map((reserva) => (
          <Box key={reserva._id} mt={2}>
            <Typography>
              Sala: {reserva.sala.nome} - De: {new Date(reserva.dataInicio).toLocaleString()} Até: {new Date(reserva.dataFim).toLocaleString()}
            </Typography>
            <Button color="primary" onClick={() => handleEditReserva(reserva)}>Editar</Button>
            <Button color="secondary" onClick={() => handleDeleteReserva(reserva._id)}>Cancelar</Button>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default AdminPage;
