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
  upload.single('imagem'), // <- trata o upload da imagem (opcional)
  estabelecimentoController.criar
);

// 📄 Listar estabelecimentos
router.get("/list", verifyToken, estabelecimentoController.listar);
router.get("/imagens",verifyToken,estabelecimentoController.getLogo);
module.exports = router;



/*
const express = require("express");
const router = express.Router();
const estabelecimentoController = require("../controllers/estabelecimento.controller");

const verifyToken = require("../utils/verifyToken");


router.post("/create",verifyToken,estabelecimentoController.criar);

router.get("/list",verifyToken,estabelecimentoController.listar);


module.exports = router;

*/