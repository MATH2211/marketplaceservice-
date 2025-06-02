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
        console.log(`Req.idEstabelecimento: ${id_estabelecimento}`);
        const lista = await servicoService.getServices({id_estabelecimento});
        res.json(lista);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



module.exports = {
    criar,
    listar,
};
