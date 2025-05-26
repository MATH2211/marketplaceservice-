require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

const app = express();

// Config Cloudinary usando variáveis de ambiente
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer (armazenamento em memória)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Rota de upload
app.post('/upload', upload.single('imagem'), (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'imagens',
    },
    (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao fazer upload' });
      }
      res.json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
