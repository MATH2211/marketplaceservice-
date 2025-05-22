const express = require('express');
const router = express.Router();
const estabelecimentoController = require('../controllers/estabelecimento.controller');
const verifyToken = require('../utils/verifyToken');
const path = require("path");


// Todas as rotas abaixo são protegidas por token JWT

// Criar novo estabelecimento
router.post('/create', verifyToken, estabelecimentoController.criar);
router.get("/",(req, res) => {
    const caminho = path.join(__dirname, "../../web/pages/dashboard.html");
    res.sendFile(caminho);
  });

router.get("/list",verifyToken, estabelecimentoController.listar)


// Listar todos os estabelecimentos do admin
//router.get('/', verifyToken, estabelecimentoController.listar);

// Deletar um estabelecimento (se for do admin)
router.delete('/:id', verifyToken, estabelecimentoController.deletar);

module.exports = router;
