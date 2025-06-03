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

//const servicoService = require("../services/servicos.service");

async function atualizarImagem(req, res) {
    try {
        const { id_estabelecimento, id_servico } = req.params;
        const { imagem_url } = req.body;

        if (!imagem_url) {
            return res.status(400).json({ error: "O campo 'imagem_url' é obrigatório." });
        }

        const servicoAtualizado = await servicoService.updateImagemServico({
            id: id_servico,
            id_estabelecimento,
            imagem_url
        });

        if (!servicoAtualizado) {
            return res.status(404).json({ error: "Serviço não encontrado ou não pertence a este estabelecimento." });
        }

        res.json(servicoAtualizado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function deletar(req, res) {
    try {
        const { id_estabelecimento, id_servico } = req.params;

        const deletado = await servicoService.deleteService({
            id_estabelecimento,
            id_servico
        });

        if (!deletado) {
            return res.status(404).json({ error: "Serviço não encontrado ou não pertence a este estabelecimento." });
        }

        res.json({ message: "Serviço deletado com sucesso." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



module.exports = {
    criar,
    listar,
    deletar,
    atualizarImagem
};
