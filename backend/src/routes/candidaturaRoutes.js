const express = require('express');
const router = express.Router();
const candidaturaController = require('../controllers/candidaturaController');
const { verificarVoluntario, verificarOng } = require('../middlewares/authMiddleware');

router.post('/', verificarVoluntario, candidaturaController.criar);
router.get('/minhas', verificarVoluntario, candidaturaController.obterEnviadas);
router.get('/minhas-vagas', verificarOng, candidaturaController.obterRecebidas);
router.put('/:id/estado', verificarOng, candidaturaController.atualizarEstado);

module.exports = router;