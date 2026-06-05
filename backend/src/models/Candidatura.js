const mongoose = require('mongoose');

const candidaturaSchema = new mongoose.Schema({
  vagaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vaga', required: true },
  voluntarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilizador', required: true },
  data: { type: Date, default: Date.now },
  estado: { type: String, enum: ['pendente', 'aceite', 'rejeitada'], default: 'pendente' }
});

module.exports = mongoose.model('Candidatura', candidaturaSchema);