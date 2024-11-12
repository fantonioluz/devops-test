import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api/axiosConfig';
import ReservaCard from '../components/ReservaCard';
import SalaCard from '../components/SalaCard';

function Dashboard() {
  const [reservas, setReservas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [salasDisponiveis, setSalasDisponiveis] = useState([]);

  // Função para buscar reservas do usuário
  const fetchReservas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/reservas/usuario', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservas(response.data);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // Função para buscar salas disponíveis
  const fetchSalasDisponiveis = async () => {
    try {
      const response = await api.get('/salas/disponiveis', {
        params: { dataInicio, dataFim },
      });
      setSalasDisponiveis(response.data);
    } catch (error) {
      console.error('Erro ao buscar salas disponíveis', error);
    }
  };

  // Função para criar reserva
  const handleCreateReserva = async (salaId) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/reservas', { salaId, dataInicio, dataFim }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Reserva criada com sucesso!');
      setModalOpen(false);
      fetchReservas(); // Recarrega a lista de reservas
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      alert('Erro ao criar reserva');
    }
  };

  const isSameDay = (date1, date2) => {
    return (
      date1 &&
      date2 &&
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <Container>
      <Typography variant="h4">Minhas Reservas</Typography>
      <Box mt={2}>
        {reservas.map((reserva) => (
          <ReservaCard key={reserva._id} reserva={reserva} onReservaChange={fetchReservas} />
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
        style={{ marginTop: '20px' }}
      >
        Criar Reserva
      </Button>

      {/* Modal para Criar Reserva */}
      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        center 
        styles={{
          modal: {
            width: '90%', 
            maxWidth: '800px',
            height: 'auto',
            padding: '20px',
            maxHeight: '90vh', 
            borderRadius: '10px',
            overflow: 'auto',
          }
        }}
      >
        <Box width="100%">
          <Typography variant="h6" gutterBottom>Formulário de Reserva</Typography>

          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            gap={2} 
            mb={2}
          >
            <DatePicker
              selected={dataInicio}
              onChange={(date) => setDataInicio(date)}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Data e Hora de Início"
              minDate={new Date()} // Não permite datas passadas
              minTime={isSameDay(dataInicio, new Date()) ? new Date() : new Date(new Date().setHours(0, 0))} // Horário mínimo: agora se o início é hoje, 00:00 caso contrário
              maxTime={new Date(new Date().setHours(23, 59))} // Horário máximo: fim do dia
              popperContainer={({ children }) => <div style={{ zIndex: 1000 }}>{children}</div>}
              customInput={<Button variant="outlined">Selecionar Início</Button>}
            />

            <DatePicker
              selected={dataFim}
              onChange={(date) => setDataFim(date)}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Data e Hora de Fim"
              minDate={dataInicio || new Date()} // Data mínima: mesma data de início ou hoje
              minTime={
                isSameDay(dataInicio, dataFim) && dataInicio
                  ? dataInicio
                  : new Date(new Date().setHours(0, 0))
              } // Horário mínimo: data de início, ou 00:00 se for um dia diferente
              maxTime={new Date(new Date().setHours(23, 59))} // Horário máximo: fim do dia
              popperContainer={({ children }) => <div style={{ zIndex: 1000 }}>{children}</div>}
              customInput={<Button variant="outlined">Selecionar Fim</Button>}
            />
          </Box>

          {/* Exibir datas selecionadas */}
          <Box mb={2} textAlign="center">
            <Typography variant="body1">
              {dataInicio && dataFim
                ? `Selecionado: Início - ${dataInicio.toLocaleString()} | Fim - ${dataFim.toLocaleString()}`
                : 'Por favor, selecione a data e hora de início e fim.'}
            </Typography>
          </Box>

          

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={fetchSalasDisponiveis}
            style={{ marginTop: '10px' }}
          >
            Buscar Salas Disponíveis
          </Button>
          <Box height="160px" />


          <Box mt={2} display="flex" flexWrap="wrap" justifyContent="center">
            {salasDisponiveis.map((sala) => (
              <motion.div
                key={sala._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ margin: '10px' }}
              >
                <SalaCard sala={sala} onReserve={() => handleCreateReserva(sala._id)} />
              </motion.div>
            ))}
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}

export default Dashboard;
