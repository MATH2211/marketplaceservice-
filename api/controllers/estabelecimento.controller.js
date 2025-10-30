const estabelecimentoService = require('../services/estabelecimento.service');
const image = require('../cloudinary/image.methods')
const imagemService = require('../services/imagem.service');



async function criar(req, res) {
  console.log("controller criar")
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
      console.log("Tem imagem");
      const resultado = await image.uploadImagem(req.file.buffer, 'estabelecimentos');

      await imagemService.salvarImagem({
        imagem_url: resultado.url,
        tipo: 'logo',
        id_estabelecimento: novoEstabelecimento.id,
      });
    }else{
      console.log('não tem imagem');
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
    const imagens = await imagemService.getLogoByIdAdmin(adminId);
    res.json({estabelecimentos, imagens});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listarTodos(req, res) {
  try {
    const estabelecimentos = await estabelecimentoService.listarTodosEstabelecimentos();
    const imagens = await imagemService.buscarTodasImagens();
    res.json({ estabelecimentos, imagens });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLogo(req,res) {
    try{
      const adminId = req.adminId;
      const imagens = await imagemService.getLogoByIdAdmin(adminId);
      res.json(imagens);
    }catch (err){
      res.status(500).json({error: err.message});
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
  deletar,
  getLogo,
  listarTodos  // ← ADICIONAR
};

