const express = require('express');
const router = express.Router();
const estabelecimentoController = require('../controllers/estabelecimento.controller');
const verifyToken = require('../utils/verifyToken');

// Todas as rotas abaixo são protegidas por token JWT

// Criar novo estabelecimento
router.post('/', verifyToken, estabelecimentoController.criar);

// Listar todos os estabelecimentos do admin
router.get('/', verifyToken, estabelecimentoController.listar);

// Deletar um estabelecimento (se for do admin)
router.delete('/:id', verifyToken, estabelecimentoController.deletar);

module.exports = router;
