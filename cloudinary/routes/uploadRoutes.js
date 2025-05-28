const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const verifyToken = require('../utils/verifyToken');

// Multer (armazenamento em memória)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔐 Rota protegida
router.post('/upload', verifyToken, upload.single('imagem'), uploadController.uploadImagem);

// 🚀 Se quiser, pode criar uma rota pública também
// router.post('/upload-publico', upload.single('imagem'), uploadController.uploadImagem);

module.exports = router;