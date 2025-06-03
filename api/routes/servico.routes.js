const express = require("express");
const router = express.Router();
const servicoController = require("../controllers/servicos.controller");

const verifyToken = require("../utils/verifyToken");
const verificarEstabelecimento = require("../utils/verificarEstabelecimento");
const verifyByParams = require('../utils/verifyByParams');
// Rota para criar um serviço
const multer = require('multer');
const upload = multer();

router.post(
  '/create',
  verifyToken,
  upload.single('file'), // se tiver imagem
  verificarEstabelecimento,
  servicoController.criar
);


// Rota para listar serviços de um estabelecimento

/*
router.get(
  "/list/:id_estabelecimento",
  verifyToken,
  verificarEstabelecimento,
  servicoController.listar
);
*/

router.get(
  "/list/:id_estabelecimento",
  servicoController.listar
);

// Atualizar imagem do serviço
// PUT /servicos/:id_estabelecimento/:id_servico/imagem
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
