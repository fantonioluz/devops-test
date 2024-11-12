const mongoose = require('mongoose');
const ReservaSchema = new mongoose.Schema({
  sala: { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dataInicio: { type: Date, required: true },
  dataFim: { type: Date, required: true },
});

module.exports = mongoose.model('Reserva', ReservaSchema);
