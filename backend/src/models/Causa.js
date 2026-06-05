const mongoose = require('mongoose');

const causaSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true } // unique evita causas repetidas
});

module.exports = mongoose.model('Causa', causaSchema);