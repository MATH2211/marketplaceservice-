const express = require("express");
const router = express.Router();
const estabelecimentoController = require("../controllers/estabelecimento.controller");
const verifyToken = require("../utils/verifyToken");
const multer = require('multer');

// Multer configura armazenamento em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📤 Criar estabelecimento (com ou sem imagem)
router.post(
  "/create",
  verifyToken,
  upload.single('imagem'),
  estabelecimentoController.criar
);

// 📄 Listar estabelecimentos do usuário
router.get("/list", verifyToken, estabelecimentoController.listar);

// 🖼️ Buscar imagens
router.get("/imagens", verifyToken, estabelecimentoController.getLogo);

// 🌍 Listar TODOS os estabelecimentos do sistema
router.get("/todos", verifyToken, estabelecimentoController.listarTodos);

// ⚠️ module.exports DEVE SER O ÚLTIMO, apenas UMA VEZ
module.exports = router;
