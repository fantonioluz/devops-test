const Sala = require('../models/Sala');
const Reserva = require('../models/Reserva');

// Controlador para criar uma nova sala
exports.criarSala = async (req, res) => {
  const { nome, capacidade, descricao } = req.body;
  try {
    const sala = new Sala({ nome, capacidade, descricao });
    await sala.save();
    res.status(201).json(sala);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar sala' });
  }
};

// Controlador para atualizar uma sala existente
exports.atualizarSala = async (req, res) => {
  try {
    const sala = await Sala.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sala) return res.status(404).json({ msg: 'Sala não encontrada' });
    res.json(sala);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao atualizar sala' });
  }
};

// Controlador para deletar uma sala
exports.deletarSala = async (req, res) => {
  try {
    const sala = await Sala.findByIdAndDelete(req.params.id);
    if (!sala) return res.status(404).json({ msg: 'Sala não encontrada' });
    res.json({ msg: 'Sala deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao deletar sala' });
  }
};

exports.listarSalas = async (req, res) => {
    try {
      const salas = await Sala.find();
      res.json(salas);
    } catch (err) {
      res.status(500).json({ msg: 'Erro ao buscar salas' });
    }
  };


exports.listarSalasDisponiveis = async (req, res) => {
  const { dataInicio, dataFim } = req.query;

  if (!dataInicio || !dataFim) {
    return res.status(400).json({ msg: 'Por favor, forneça dataInicio e dataFim' });
  }

  try {
    // Converte as datas para objetos de Date
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    // Busca todas as reservas que conflitam com o intervalo de data e horário fornecido
    const reservasConflitantes = await Reserva.find({
      $or: [
        { dataInicio: { $lt: fim, $gte: inicio } },
        { dataFim: { $gt: inicio, $lte: fim } },
        { dataInicio: { $lte: inicio }, dataFim: { $gte: fim } }
      ]
    }).select('sala'); // Seleciona apenas o campo 'sala' das reservas conflitantes

    // Extrai os IDs das salas ocupadas
    const salasOcupadasIds = reservasConflitantes.map(reserva => reserva.sala);

    // Busca as salas que não estão nos IDs das ocupadas
    const salasDisponiveis = await Sala.find({
      _id: { $nin: salasOcupadasIds }
    });

    res.json(salasDisponiveis);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar salas disponíveis' });
  }
};