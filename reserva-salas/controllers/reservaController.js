const Reserva = require('../models/Reserva');
const Sala = require('../models/Sala');

exports.criarReserva = async (req, res) => {
  const { salaId, dataInicio, dataFim } = req.body;
  try {
    // Verifica se a sala existe
    const sala = await Sala.findById(salaId);
    if (!sala) {
      return res.status(404).json({ msg: 'Sala não encontrada' });
    }

    // Cria a reserva
    const reserva = new Reserva({
      sala: salaId,
      usuario: req.user,
      dataInicio,
      dataFim,
    });
    await reserva.save();

    res.status(201).json({ msg: 'Reserva criada com sucesso', reserva });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find().populate('sala').populate('usuario');
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.alterarReserva = async (req, res) => {
  const { id } = req.params;
  const { dataInicio, dataFim } = req.body;
  try {
    const reserva = await Reserva.findByIdAndUpdate(id, { dataInicio, dataFim }, { new: true });
    if (!reserva) return res.status(404).json({ msg: 'Reserva não encontrada' });
    res.json(reserva);
  } catch (err) {
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.cancelarReserva = async (req, res) => {
  const { id } = req.params;
  try {
    const reserva = await Reserva.findByIdAndDelete(id);
    if (!reserva) return res.status(404).json({ msg: 'Reserva não encontrada' });
    res.json({ msg: 'Reserva cancelada com sucesso' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

exports.listarReservasUsuario = async (req, res) => {
  try {
    const reservas = await Reserva.find({ usuario: req.user }).populate('sala', 'nome capacidade descricao');
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar reservas do usuário' });
  }
};


exports.listarReservasSala = async (req, res) => {
  try {
    const { salaId } = req.params;
    const reservas = await Reserva.find({ sala: salaId }).populate('usuario', 'name email');
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar reservas da sala' });
  }
};