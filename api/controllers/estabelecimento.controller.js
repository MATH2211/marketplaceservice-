const estabelecimentoService = require('../services/estabelecimento.service');

const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

const imagemService = require('../services/imagem.service');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Função auxiliar de upload
function uploadImagem(fileBuffer, folder = 'estabelecimentos') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
}

async function criar(req, res) {
  try {
    const adminId = req.adminId;
    const { nome, endereco } = req.body;

    // 1. Cria o estabelecimento
    const novoEstabelecimento = await estabelecimentoService.criarEstabelecimento(
      { nome, endereco },
      adminId
    );

    // 2. Se tiver imagem, faz upload e salva no banco
    if (req.file) {
      const resultado = await uploadImagem(req.file.buffer, 'estabelecimentos');

      await imagemService.salvarImagem({
        imagem_url: resultado.secure_url,
        tipo: 'logo',
        id_estabelecimento: novoEstabelecimento.id,
      });
    }

    res.status(201).json(novoEstabelecimento);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function listar(req, res) {
  try {
    const adminId = req.adminId;
    const estabelecimentos = await estabelecimentoService.listarEstabelecimentos(adminId);
    res.json(estabelecimentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deletar(req, res) {
  try {
    const adminId = req.adminId;
    const { id } = req.params;
    const resultado = await estabelecimentoService.deletarEstabelecimento(id, adminId);
    res.json(resultado);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

module.exports = {
  criar,
  listar,
  deletar
};
