const express = require('express');

const router = express.Router();

const horariosController = require('../controllers/horarios.controller');
const verifyToken = require('../utils/verifyToken');
const verificarEstabelecimento = require('../utils/verificarEstabelecimento');

const verificarEstabelecimentoProfissional = require('../utils/verificarEstabelecimentoProfissional');

router.post('/create',verifyToken,verificarEstabelecimentoProfissional,horariosController.postNewHorario);


module.exports = router;