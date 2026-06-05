require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importar as Rotas
const authRoutes = require('./src/routes/authRoutes');
const vagaRoutes = require('./src/routes/vagaRoutes');
const ongRoutes = require('./src/routes/ongRoutes');
const candidaturaRoutes = require('./src/routes/candidaturaRoutes');
const causaRoutes = require('./src/routes/causaRoutes');



const app = express();

// Configurações Globais
app.use(cors());
app.use(express.json());

// 1. LIGAÇÃO AO MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Ligado ao MongoDB com sucesso!'))
  .catch(err => console.error('Erro ao ligar ao MongoDB:', err));

// 2. LIGAÇÃO DAS ROTAS (Prefixos)
app.use('/api', authRoutes); // O registo, login e perfil já ficam com /api/login, etc.
app.use('/api/vagas', vagaRoutes);
app.use('/api/ongs', ongRoutes);
app.use('/api/candidaturas', candidaturaRoutes);  
app.use('/api/causas', causaRoutes);
// 3. ARRANCAR O SERVIDOR
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API a correr na porta ${PORT}!!!`); // <-- Muda o texto aqui
});