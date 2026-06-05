const Candidatura = require('../models/Candidatura');

exports.criar = async (req, res) => {
  try {
    const { vagaId } = req.body;
    const voluntarioId = req.utilizador.id; 

    const candidaturaExistente = await Candidatura.findOne({ vagaId, voluntarioId });
    if (candidaturaExistente) return res.status(400).json({ erro: 'Já se candidatou a esta oportunidade.' });

    const novaCandidatura = new Candidatura({ vagaId, voluntarioId });
    await novaCandidatura.save();
    res.status(201).json({ mensagem: 'Candidatura enviada com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao processar candidatura.' });
  }
};

exports.obterRecebidas = async (req, res) => {
  try {
    const candidaturas = await Candidatura.find()
      .populate('voluntarioId', 'nome email') 
      .populate('vagaId', 'titulo localizacao'); 
    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao carregar candidaturas.' });
  }
};

exports.obterEnviadas = async (req, res) => {
  try {
    const candidaturas = await Candidatura.find({ voluntarioId: req.utilizador.id })
      .populate('vagaId', 'titulo causa localizacao imagem'); 
    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao carregar histórico.' });
  }
};

exports.atualizarEstado = async (req, res) => {
  try {
    const Candidatura = require('../models/Candidatura');
    const Vaga = require('../models/Vaga');
    
    const { id } = req.params;
    const { novoEstado } = req.body;

    const candidatura = await Candidatura.findById(id);
    if (!candidatura) return res.status(404).json({ erro: 'Candidatura não encontrada.' });


    // LÓGICA DA BARRA DE PROGRESSO
    if (novoEstado === 'aceite' && candidatura.estado !== 'aceite') {
      const vaga = await Vaga.findById(candidatura.vagaId);
      
      if (vaga) {
        // A REDE DE SEGURANÇA: Garante que os valores são sempre números, mesmo em vagas antigas!
        const preenchidasAtual = vaga.vagasPreenchidas || 0;
        const metaTotal = vaga.vagasTotais || 1;


        if (preenchidasAtual < metaTotal) {
          vaga.vagasPreenchidas = preenchidasAtual + 1; // Soma de forma segura
          
          // Se o progresso chegar ao total, a vaga desativa
          if (vaga.vagasPreenchidas >= metaTotal) {
            vaga.ativa = false; 
          }
          await vaga.save();
        } else {
          return res.status(400).json({ erro: 'A meta já foi atingida.' });
        }
      }
    }

    // REVERSÃO (Se a ONG se enganar e tirar o "aceite")
    if (candidatura.estado === 'aceite' && novoEstado !== 'aceite') {
      const vaga = await Vaga.findById(candidatura.vagaId);
      if (vaga) {
        const preenchidasAtual = vaga.vagasPreenchidas || 0;
        // O Math.max evita que tenhamos vagas preenchidas negativas (-1)
        vaga.vagasPreenchidas = Math.max(0, preenchidasAtual - 1); 
        vaga.ativa = true; 
        await vaga.save();
      }
    }

    candidatura.estado = novoEstado;
    await candidatura.save();

    res.json({ mensagem: 'Estado atualizado!', candidatura });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar.' });
  }
};