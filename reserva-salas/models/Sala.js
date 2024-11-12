const mongoose = require('mongoose');
const SalaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  capacidade: { type: Number, required: true },
  descricao: { type: String },
});

module.exports = mongoose.model('Sala', SalaSchema);
