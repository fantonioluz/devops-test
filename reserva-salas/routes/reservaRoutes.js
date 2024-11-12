const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { criarReserva, listarReservas, alterarReserva, cancelarReserva, listarReservasUsuario, listarReservasSala } = require('../controllers/reservaController');

/**
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Cria uma nova reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               salaId:
 *                 type: string
 *                 description: ID da sala a ser reservada
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora de início da reserva
 *               dataFim:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora de término da reserva
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *       404:
 *         description: Sala não encontrada
 *       500:
 *         description: Erro do servidor
 */
router.post('/', auth, criarReserva);

/**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Lista todas as reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   sala:
 *                     type: object
 *                     description: Detalhes da sala reservada
 *                   usuario:
 *                     type: object
 *                     description: Detalhes do usuário que fez a reserva
 *                   dataInicio:
 *                     type: string
 *                     format: date-time
 *                   dataFim:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erro do servidor
 */
router.get('/', auth, listarReservas);

/**
 * @swagger
 * /api/reservas/{id}:
 *   put:
 *     summary: Atualiza uma reserva (usuário ou administrador)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *               dataFim:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Reserva atualizada com sucesso
 *       404:
 *         description: Reserva não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.put('/:id', auth, alterarReserva);

/**
 * @swagger
 * /api/reservas/{id}:
 *   delete:
 *     summary: Cancela uma reserva (usuário ou administrador)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da reserva
 *     responses:
 *       200:
 *         description: Reserva cancelada com sucesso
 *       404:
 *         description: Reserva não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:id', auth, cancelarReserva);


/**
 * @swagger
 * /api/reservas/usuario:
 *   get:
 *     summary: Lista todas as reservas do usuário autenticado
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   sala:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                       capacidade:
 *                         type: integer
 *                       descricao:
 *                         type: string
 *                   dataInicio:
 *                     type: string
 *                     format: date-time
 *                   dataFim:
 *                     type: string
 *       500:
 *         description: Erro ao buscar reservas do usuário
 */
router.get('/usuario', auth, listarReservasUsuario);

/**
 * @swagger
 * /api/reservas/sala/{salaId}:
 *   get:
 *     summary: Lista todas as reservas de uma sala específica
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da sala para listar reservas
 *     responses:
 *       200:
 *         description: Lista de reservas da sala
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                   dataInicio:
 *                     type: string
 *                     format: date-time
 *                   dataFim:
 *                     type: string
 *       404:
 *         description: Sala não encontrada
 *       500:
 *         description: Erro ao buscar reservas da sala
 */
router.get('/sala/:salaId', auth, listarReservasSala);

module.exports = router;
