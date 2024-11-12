const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminMiddleware');
const { criarSala, atualizarSala, deletarSala, listarSalas, listarSalasDisponiveis } = require('../controllers/salaController');

/**
 * @swagger
 * /api/salas:
 *   post:
 *     summary: Cria uma nova sala (somente para administradores)
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               capacidade:
 *                 type: integer
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro ao criar sala
 */
router.post('/', auth, adminAuth, criarSala);

/**
 * @swagger
 * /api/salas/{id}:
 *   put:
 *     summary: Atualiza uma sala existente (somente para administradores)
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da sala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               capacidade:
 *                 type: integer
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sala atualizada com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Sala não encontrada
 *       500:
 *         description: Erro ao atualizar sala
 */
router.put('/:id', auth, adminAuth, atualizarSala);

/**
 * @swagger
 * /api/salas/{id}:
 *   delete:
 *     summary: Deleta uma sala (somente para administradores)
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da sala
 *     responses:
 *       200:
 *         description: Sala deletada com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Sala não encontrada
 *       500:
 *         description: Erro ao deletar sala
 */
router.delete('/:id', auth, adminAuth, deletarSala);


/**
 * @swagger
 * /api/salas:
 *   get:
 *     summary: Lista todas as salas
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas as salas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   capacidade:
 *                     type: integer
 *                   descricao:
 *                     type: string
 *       500:
 *         description: Erro ao buscar salas
 */
router.get('/', auth, listarSalas);



/**
 * @swagger
 * /api/salas/disponiveis:
 *   get:
 *     summary: Lista salas disponíveis para uma data e horário específicos
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data e hora de início do intervalo desejado
 *       - in: query
 *         name: dataFim
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data e hora de término do intervalo desejado
 *     responses:
 *       200:
 *         description: Lista de salas disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   capacidade:
 *                     type: integer
 *                   descricao:
 *                     type: string
 *       400:
 *         description: Parâmetros de data inválidos
 *       500:
 *         description: Erro ao buscar salas disponíveis
 */
router.get('/disponiveis', auth, listarSalasDisponiveis);   

module.exports = router;
