const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const cors = require('cors');

const app = express();

connectDB();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:3030",  // Se estiver rodando localmente
  "http://localhost:9090",  // Se estiver fazendo port-forward
  "http://frontend.local",  // Se estiver acessando via Ingress
  "http://frontend-service:3030" // Comunicação dentro do cluster
];

app.use(cors({
  origin: allowedOrigins,
}));

// Rota para documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reservas', require('./routes/reservaRoutes'));
app.use('/api/salas', require('./routes/salaRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
