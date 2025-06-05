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
)


module.exports = router;
