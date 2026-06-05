const express = require('express');
const router = express.Router();
const ongController = require('../controllers/ongController');

router.get('/', ongController.obterTodas);
router.get('/:id', ongController.obterPorId);
router.get('/:id/vagas', ongController.obterVagas);

module.exports = router;