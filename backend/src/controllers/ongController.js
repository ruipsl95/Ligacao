const Utilizador = require('../models/Utilizador');
const Vaga = require('../models/Vaga');

exports.obterTodas = async (req, res) => {
  try {
    const ongs = await Utilizador.find({ tipo: 'ong' }).select('-password');
    res.json(ongs);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao carregar o diretório de instituições.' });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const ong = await Utilizador.findById(req.params.id).select('-password');
    if (!ong || ong.tipo !== 'ong') return res.status(404).json({ erro: 'Instituição não encontrada.' });
    res.json(ong);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao carregar perfil da Instituição.' });
  }
};

exports.obterVagas = async (req, res) => {
  try {
    const vagas = await Vaga.find({ ongId: req.params.id }); 
    res.json(vagas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao carregar as vagas da Instituição.' });
  }
};