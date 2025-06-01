const servicoService = require("../services/servicos.service");

async function criar(req, res) {
    try {
        const { nome, valor, tempo } = req.body;
        const id_estabelecimento = req.idEstabelecimento;

        const novo = await servicoService.newServico({
            nome,
            valor,
            tempo,
            id_estabelecimento,
        });

        res.status(201).json(novo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function listar(req, res) {
    try {
        const id_estabelecimento = req.idEstabelecimento;

        const lista = await servicoService.listarServicos(id_estabelecimento);
        res.json(lista);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    criar,
    listar,
};
