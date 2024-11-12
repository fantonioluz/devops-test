import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import api from '../api/axiosConfig';

function LoginPage() {
  const { register, handleSubmit, reset } = useForm();
  const [isRegister, setIsRegister] = useState(false); // Alterna entre login e registro

  const onSubmit = async (data) => {
    try {
      if (isRegister) {
        // Registro do usuário
        await api.post('/auth/register', data);
        alert('Registro bem-sucedido! Faça login para continuar.');
        setIsRegister(false);
        reset();
      } else {
        // Login do usuário
        const response = await api.post('/auth/login', data);
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error("Erro de autenticação", error);
      alert(isRegister ? 'Erro no registro' : 'Erro no login');
    }
    try {
        const response = await api.post('/auth/login', data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Inclui o papel do usuário
        window.location.href = '/dashboard';
      } catch (error) {
        console.error("Erro de autenticação", error);
        alert('Erro no login');
      }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h5">{isRegister ? 'Registrar' : 'Login'}</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {isRegister && (
            <TextField
              label="Nome"
              fullWidth
              margin="normal"
              {...register("name", { required: true })}
            />
          )}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email", { required: true })}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", { required: true })}
          />
          <Button type="submit" variant="contained" fullWidth>
            {isRegister ? 'Registrar' : 'Entrar'}
          </Button>
        </form>
        <Button
          color="secondary"
          fullWidth
          onClick={() => {
            setIsRegister(!isRegister);
            reset();
          }}
          style={{ marginTop: '10px' }}
        >
          {isRegister ? 'Já tem uma conta? Faça Login' : 'Não tem uma conta? Registre-se'}
        </Button>
      </Box>
    </Container>
  );
}

export default LoginPage;
