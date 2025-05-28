const cloudinaryService = require('../services/cloudinaryService');

async function uploadImagem(req, res) {
    try {
        const result = await cloudinaryService.uploadImagem(req.file.buffer);
        res.json({
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer upload' });
    }
}

module.exports = {
    uploadImagem,
};
