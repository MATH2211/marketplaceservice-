const express = require('express');

const router = express.Router();

const horariosController = require('../controllers/horarios.controller');
const verifyToken = require('../utils/verifyToken');
const verificarEstabelecimento = require('../utils/verificarEstabelecimento');

const verificarEstabelecimentoProfissional = require('../utils/verificarEstabelecimentoProfissional');

router.post('/create',verifyToken,verificarEstabelecimentoProfissional,horariosController.postNewHorario);

router.get('/:id_estabelecimento/:id_profissional/:dia/status',horariosController.getHorarios);

router.post('/get',verifyToken,verificarEstabelecimentoProfissional,horariosController.getPrivateHorarios);


module.exports = router;