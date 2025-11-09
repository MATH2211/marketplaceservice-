const express = require('express');
const router = express.Router();

const profissionalController = require("../controllers/profissional.controller");

const verifyToken = require("../utils/verifyToken");
const verificarEstabelecimento = require("../utils/verificarEstabelecimento");

const multer = require('multer');
const upload = multer();

// Criar profissional
router.post(
    "/create",
    verifyToken,
    upload.single('file'),
    verificarEstabelecimento,
    profissionalController.criar
);

// Listar todos os profissionais de um estabelecimento (público)
router.get(
    "/public_all/:id_estabelecimento",
    profissionalController.listarTodos
);

// Buscar profissional por ID (descomente se precisar)
// router.get(
//     "/:id",
//     profissionalController.buscarPorId
// );

// Atualizar profissional
router.put(
    "/:id",
    verifyToken,
    upload.single('file'),
    verificarEstabelecimento,
    profissionalController.atualizar
);

// Deletar profissional
router.delete(
    "/:id",
    verifyToken,
    verificarEstabelecimento,
    profissionalController.deletar
);

// Listar todos os profissionais (privado)
router.post(
    '/all/privado',
    verifyToken,
    verificarEstabelecimento,
    profissionalController.listarTodosPrivado
);

module.exports = router;
