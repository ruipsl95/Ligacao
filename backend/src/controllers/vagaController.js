const Vaga = require('../models/Vaga');

exports.criarVaga = async (req, res) => {
  try {
    console.log("Dados recebidos no backend para criar vaga:", req.body); // ADICIONA ISTO
    const { titulo, descricaoCurta, localizacao, disponibilidade, causa, imagem, vagasTotais } = req.body;
    const novaVaga = new Vaga({
      titulo, descricaoCurta, localizacao, disponibilidade, causa, imagem,
      vagasTotais: vagasTotais || 1, ativa: true, ongId: req.utilizador.id
    });
    await novaVaga.save();
    res.status(201).json(novaVaga);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar vaga.' });
  }
};

exports.obterTodas = async (req, res) => {
  try {
    const vagas = await Vaga.find();
    res.json(vagas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao carregar as vagas.' });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const vaga = await Vaga.findById(req.params.id);
    if (!vaga) return res.status(404).json({ erro: 'Vaga não encontrada.' });
    res.json(vaga);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao carregar detalhes da vaga.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const vagaAtualizada = await Vaga.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vagaAtualizada);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar a vaga.' });
  }
};

exports.remover = async (req, res) => {
  try {
    await Vaga.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Vaga removida com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover a vaga.' });
  }
};