const express = require("express");
const router = express.Router();
const servicoController = require("../controllers/servicos.controller");

const verifyToken = require("../utils/verifyToken");
const verificarEstabelecimento = require("../utils/verificarEstabelecimento");

// Rota para criar um serviço
router.post(
  "/create",
  verifyToken,
  verificarEstabelecimento,
  servicoController.criar
);

// Rota para listar serviços de um estabelecimento
router.get(
  "/list/:id_estabelecimento",
  verifyToken,
  verificarEstabelecimento,
  servicoController.listar
);

module.exports = router;
