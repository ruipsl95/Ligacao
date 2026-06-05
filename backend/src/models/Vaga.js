const mongoose = require('mongoose');

const vagaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricaoCurta: { type: String, required: true },
  localizacao: { type: String, required: true },
  disponibilidade: { type: String, required: true },
  causa: { type: String, required: true },
  imagem: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=600&auto=format&fit=crop' 
  },
  ongId: { type: String, required: true },
  vagasTotais: { type: Number, required: true, default: 1 }, 
  vagasPreenchidas: { type: Number, default: 0 },
  ativa: { type: Boolean, default: true }
});

module.exports = mongoose.model('Vaga', vagaSchema);