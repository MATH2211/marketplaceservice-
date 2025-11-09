const profissionalService = require("../services/profissional.service");
const image = require("../cloudinary/image.methods");

async function criar(req, res) {
    try {
        const { nome, celular, email } = req.body;
        const id_estabelecimento = req.idEstabelecimento;

        const novo = await profissionalService.postProfissionais({ nome, celular, email, id_estabelecimento });

        if (req.file) {
            const resultado = await image.uploadImagem(req.file.buffer, 'profissionais');
            const atualizado = await profissionalService.updateImagemProfissional({
                id: novo.id,
                id_estabelecimento,
                imagem_url: resultado.url,
            });
            return res.status(201).json(atualizado);
        }

        return res.status(201).json(novo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const { id } = req.params;
        const id_estabelecimento = req.idEstabelecimento;

        const profissional = await profissionalService.getProfissionalById({ id, id_estabelecimento });

        if (!profissional) {
            return res.status(404).json({ error: "Profissional não encontrado" });
        }

        res.json(profissional);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

async function atualizar(req, res) {
    try {
        const { id } = req.params;
        const id_estabelecimento = req.idEstabelecimento;
        const { nome, celular, email } = req.body;

        let atualizado = await profissionalService.updateProfissional({ id, id_estabelecimento, nome, celular, email });

        if (req.file) {
            const resultado = await image.uploadImagem(req.file.buffer, 'profissionais');
            atualizado = await profissionalService.updateImagemProfissional({
                id,
                id_estabelecimento,
                imagem_url: resultado.url,
            });
        }

        res.json(atualizado);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

async function deletar(req, res) {
    try {
        const { id } = req.params;
        const id_estabelecimento = req.idEstabelecimento;

        const deletado = await profissionalService.deleteProfissional({ id, id_estabelecimento });

        if (!deletado) {
            return res.status(404).json({ error: "Profissional não encontrado ou não pertence ao estabelecimento" });
        }

        res.json({ message: "Profissional deletado com sucesso" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

async function listarTodos(req, res) {
    try {
        const id_estabelecimento = req.params.id_estabelecimento;
        const profissionais = await profissionalService.getAllProfissionais(id_estabelecimento);
        return res.json(profissionais);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

// NOVA FUNÇÃO: Listar profissionais por estabelecimento (rota personalizada)
async function listarPorEstabelecimento(req, res) {
    try {
        const { id } = req.params;
        console.log('Buscando profissionais do estabelecimento:', id);
        const profissionais = await profissionalService.getAllProfissionais(id);
        res.json({ profissionais });
    } catch (error) {
        console.error('Erro ao listar profissionais:', error);
        res.status(500).json({ error: 'Erro ao listar profissionais' });
    }
}

async function listarTodosPrivado(req, res) {
    try {
        const id_estabelecimento = req.idEstabelecimento; // assume que middleware já setou
        const profissionais = await profissionalService.getAllProfissionaisPrivado(id_estabelecimento);
        return res.json(profissionais);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    criar,
    buscarPorId,
    atualizar,
    deletar,
    listarTodos,
    listarTodosPrivado,
    listarPorEstabelecimento // adiciona para exportação e uso em routes
};
