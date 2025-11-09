const express = require("express");
const router = express.Router();
const servicoController = require("../controllers/servicos.controller");

const verifyToken = require("../utils/verifyToken");
const verificarEstabelecimento = require("../utils/verificarEstabelecimento");
const verifyByParams = require('../utils/verifyByParams');
const multer = require('multer');
const upload = multer();

router.post(
  '/create',
  verifyToken,
  upload.single('file'),
  verificarEstabelecimento,
  servicoController.criar
);

router.get('/public_all/:id_estabelecimento', servicoController.listarTodos);

// CORRIGIDO - removido verificarEstabelecimento
router.get(
  "/list/:id_estabelecimento",
  verifyToken,
  servicoController.listar
);

router.put(
  '/edit/:id_estabelecimento/:id_servico',
  verifyToken,
  verifyByParams,
  servicoController.editar
);

router.put(
  "/:id_estabelecimento/:id_servico/imagem",
  verifyToken,
  verifyByParams,
  servicoController.atualizarImagem
);

router.delete(
  "/:id_estabelecimento/:id_servico",
  verifyToken,
  verifyByParams,
  servicoController.deletar
);

module.exports = router;
