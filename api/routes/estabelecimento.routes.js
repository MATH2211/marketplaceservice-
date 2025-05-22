const express = require("express");

const router = express.Router();

const estabelecimentoController = require("../controllers/estabelecimento.controller");

const verifyToken = require("../utils/verifyToken");


router.post("/create",verifyToken,estabelecimentoController.criar);

router.get("/list",verifyToken,estabelecimentoController.listar);


module.exports = router;