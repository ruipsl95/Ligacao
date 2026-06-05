const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/registo', authController.registar);
router.post('/login', authController.login);
router.get('/perfil', verificarToken, authController.obterPerfil);
router.put('/perfil', verificarToken, authController.atualizarPerfil);

router.post('/favoritos', verificarToken, authController.alternarFavorito);
router.get('/favoritos', verificarToken, authController.obterFavoritos);


module.exports = router;