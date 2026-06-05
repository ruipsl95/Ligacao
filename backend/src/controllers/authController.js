const Utilizador = require('../models/Utilizador');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registar = async (req, res) => {
  const { nome, email, password, tipo } = req.body;
  try {
    const utilizadorExiste = await Utilizador.findOne({ email });
    if (utilizadorExiste) return res.status(400).json({ erro: 'Este email já está registado.' });

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const novoUtilizador = new Utilizador({ nome, email, password: passwordEncriptada, tipo });
    await novoUtilizador.save();
    res.status(201).json({ mensagem: 'Utilizador registado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno no servidor ao registar.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const utilizador = await Utilizador.findOne({ email });
    if (!utilizador) return res.status(400).json({ erro: 'Email ou password incorretos.' });

    const passwordCorreta = await bcrypt.compare(password, utilizador.password);
    if (!passwordCorreta) return res.status(400).json({ erro: 'Email ou password incorretos.' });

    const token = jwt.sign(
      { id: utilizador._id, tipo: utilizador.tipo }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.json({
      mensagem: 'Login efetuado com sucesso!',
      token,
      utilizador: { id: utilizador._id, nome: utilizador.nome, email: utilizador.email, tipo: utilizador.tipo }
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno no servidor ao fazer login.' });
  }
};

exports.obterPerfil = async (req, res) => {
  try {
    const utilizador = await Utilizador.findById(req.utilizador.id).select('-password');
    if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado.' });
    res.json(utilizador);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao carregar perfil.' });
  }
};

exports.atualizarPerfil = async (req, res) => {
  try {
    const { nome, email, biografia, fotografia } = req.body;
    const utilizadorAtualizado = await Utilizador.findByIdAndUpdate(
      req.utilizador.id, 
      { nome, email, biografia, fotografia },
      { new: true } 
    ).select('-password');
    res.json(utilizadorAtualizado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar as definições.' });
  }
};
exports.alternarFavorito = async (req, res) => {
  try {
    
    const utilizadorId = req.user?.userId || req.user?.id || req.utilizador?.id; 
    
    if (!utilizadorId) {
      return res.status(401).json({ erro: 'Não autorizado. ID não encontrado.' });
    }

    const Utilizador = require('../models/Utilizador');
    const utilizador = await Utilizador.findById(utilizadorId);
    
    if (!utilizador) {
      return res.status(404).json({ erro: 'Utilizador não encontrado.' });
    }

    const { vagaId } = req.body;
    const index = utilizador.vagasGuardadas.findIndex(id => id.toString() === vagaId.toString());
    
    if (index === -1) {
      utilizador.vagasGuardadas.push(vagaId);
    } else {
      utilizador.vagasGuardadas.splice(index, 1);
    }

    await utilizador.save();
    
    res.json(utilizador.vagasGuardadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar favoritos.' });
  }
};

exports.obterFavoritos = async (req, res) => {
  try {
    const Utilizador = require('../models/Utilizador');
    
    const utilizadorId = req.user?.userId || req.user?.id || req.utilizador?.id; 

    if (!utilizadorId) {
      return res.status(401).json([]); 
    }

    const utilizador = await Utilizador.findById(utilizadorId).populate('vagasGuardadas');
    
    if (!utilizador) {
      return res.status(404).json([]);
    }
    res.json(utilizador.vagasGuardadas);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao carregar favoritos.' });
  }
};