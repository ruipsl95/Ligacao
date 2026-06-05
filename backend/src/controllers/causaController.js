const Causa = require('../models/Causa');

exports.obterTodas = async (req, res) => {
  try {
    const causas = await Causa.find().sort({ nome: 1 });
    res.json(causas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao carregar causas.' });
  }
};

exports.criar = async (req, res) => {
  try {
    const { nome } = req.body;
    
    if (!nome) {
      return res.status(400).json({ erro: 'O nome é obrigatório.' });
    }

    // Procura exata (mais simples e sem RegExp para evitar erros de padrão)
    const existe = await Causa.findOne({ nome: nome });
    if (existe) {
      return res.status(400).json({ erro: 'Esta causa já existe na plataforma.' });
    }

    const novaCausa = new Causa({ nome });
    await novaCausa.save();
    res.status(201).json(novaCausa);
  } catch (error) {
    console.error("Erro no backend:", error);
    res.status(500).json({ erro: 'Erro ao criar a causa.' });
  }
};

exports.remover = async (req, res) => {
  try {
    await Causa.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Causa removida com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover a causa.' });
  }
};