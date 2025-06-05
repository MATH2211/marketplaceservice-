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
        res.status(500).json({error:err.message});
    }
}



module.exports = {
    criar
}