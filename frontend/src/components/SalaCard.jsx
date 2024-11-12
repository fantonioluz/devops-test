import React from 'react';
import { Card, CardContent, Typography, CardMedia, Button, Box } from '@mui/material';

function SalaCard({ sala, onReserve }) {
  return (
    <Card sx={{ maxWidth: 300, margin: 1 }}>
      <CardMedia
        component="img"
        height="140"
        image={`https://via.placeholder.com/300?text=${sala.nome}`} // Imagem de exemplo
        alt={sala.nome}
      />
      <CardContent>
        <Typography variant="h6">{sala.nome}</Typography>
        <Typography variant="body2" color="textSecondary">
          Capacidade: {sala.capacidade}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {sala.descricao}
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" fullWidth onClick={onReserve}>
            Reservar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SalaCard;
