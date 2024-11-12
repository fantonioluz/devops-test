const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const cors = require('cors');

const app = express();

connectDB();

app.use(express.json());

// Configure o CORS para permitir requisições do front-end
app.use(cors({
    origin: 'http://localhost:3000', // Substitua pelo endereço do front-end em produção, se necessário
  }));

// Rota para documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas da API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reservas', require('./routes/reservaRoutes'));
app.use('/api/salas', require('./routes/salaRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
