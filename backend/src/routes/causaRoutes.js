const express = require('express');
const router = express.Router();
const causaController = require('../controllers/causaController');
const { verificarOng } = require('../middlewares/authMiddleware');

router.get('/', causaController.obterTodas); // Todos podem ver para preencher os filtros
router.post('/', verificarOng, causaController.criar); // Só ONGs podem criar
router.delete('/:id', verificarOng, causaController.remover); // Só ONGs podem remover

module.exports = router;