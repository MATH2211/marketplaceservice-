const estabelecimentoService = require('../services/estabelecimento.service');

async function criar(req, res) {
  try {
    const adminId = req.adminId;
    const { nome, endereco } = req.body;
    const novo = await estabelecimentoService.criarEstabelecimento({ nome, endereco }, adminId);
    res.status(201).json(novo);
  } catch (err) {
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
