const mongoose = require('mongoose');

const utilizadorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tipo: { type: String, enum: ['ong', 'voluntario'], required: true },
  
  vagasGuardadas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vaga' }]
});

module.exports = mongoose.model('Utilizador', utilizadorSchema);