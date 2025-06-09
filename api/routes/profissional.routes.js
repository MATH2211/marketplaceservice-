const express = require('express');
const router = express.Router();

const profissionalController = require("../controllers/profissional.controller");

const verifyToken = require("../utils/verifyToken");
const verificarEstabelecimento = require("../utils/verificarEstabelecimento");

const multer = require('multer');
const upload = multer();

router.post(
    "/create",
    verifyToken,
    upload.single('file'),
    verificarEstabelecimento,
    profissionalController.criar
);

router.get(
    "/public_all/:id_estabelecimento",
    profissionalController.listarTodos
);

/*
router.get(
    "/:id",
    profissionalController.buscarPorId
);
*/

router.put(
    "/:id",
    verifyToken,
    upload.single('file'),
    verificarEstabelecimento,
    profissionalController.atualizar
);

router.delete(
    "/:id",
    verifyToken,
    verificarEstabelecimento,
    profissionalController.deletar
);

router.post(
  '/all/privado',
  verifyToken,
  verificarEstabelecimento,
  profissionalController.listarTodosPrivado
);

module.exports = router;
