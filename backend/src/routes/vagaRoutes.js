const express = require('express');
const router = express.Router();
const vagaController = require('../controllers/vagaController');
const { verificarOng } = require('../middlewares/authMiddleware');

router.get('/', vagaController.obterTodas);
router.get('/:id', vagaController.obterPorId);
router.post('/', verificarOng, vagaController.criarVaga);
router.put('/:id', verificarOng, vagaController.atualizar);
router.delete('/:id', verificarOng, vagaController.remover);

module.exports = router;