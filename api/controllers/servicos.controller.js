const servicoService = require("../services/servicos.service");
const uploadImagem = require('../controllers/estabelecimento.controller')
const image = require('../cloudinary/image.methods');

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

        if (req.file) {
            const resultado = await image.uploadImagem(req.file.buffer, 'servicos');

            const atualizado = await servicoService.updateImagemServico({
                id: novo.id,
                id_estabelecimento,
                imagem_url: resultado.url,
            });

            return res.status(201).json(atualizado);
        }

        res.status(201).json(novo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

async function listar(req, res) {
    try {
        const id_estabelecimento = req.params.id_estabelecimento;
        console.log(`Req.idEstabelecimento: ${id_estabelecimento}`);
        const lista = await servicoService.getServices({id_estabelecimento});
        res.json(lista);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function listarTodos(req, res) {
  try {
    const id_estabelecimento = req.params.id_estabelecimento;
    const servicos = await servicoService.getAllServicos(id_estabelecimento); // Ajuste para seu service correto
    res.json(servicos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
 

//const servicoService = require("../services/servicos.service");
async function atualizarImagem(req, res) {
    try {
        const { id_estabelecimento, id_servico } = req.params;

        // Verifica se a imagem foi enviada
        if (!req.file) {
            return res.status(400).json({ error: "É necessário enviar uma imagem." });
        }

        // Faz o upload da imagem (armazenamento externo, ex: Cloudinary, S3, etc.)
        const resultado = await uploadImagem(req.file.buffer, 'servicos');

        // Verifica se houve erro no upload
        if (!resultado || !resultado.url) {
            return res.status(500).json({ error: "Erro ao fazer upload da imagem." });
        }

        // Atualiza o serviço com a nova URL da imagem
        const servicoAtualizado = await servicoService.updateImagemServico({
            id: id_servico,
            id_estabelecimento,
            imagem_url: resultado.url
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
  atualizarImagem,
  listarTodos   // <<<<< ADICIONE AQUI!
};