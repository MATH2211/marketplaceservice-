const cloudinary = require('cloudinary').v2;

// 🔧 Configuração do Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

async function uploadImagem(buffer, pasta) {
    try {
        const resultado = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: pasta,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return {
            url: resultado.secure_url,
            public_id: resultado.public_id,
        };
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw error;
    }
}

async function deletarImagem(url, pasta) {
    try {
        if (!url) return;

        // Extrai o public_id da URL
        const partes = url.split('/');
        const nomeArquivo = partes[partes.length - 1];
        const publicIdSemExtensao = nomeArquivo.split('.')[0];
        const publicId = `${pasta}/${publicIdSemExtensao}`;

        const resultado = await cloudinary.uploader.destroy(publicId);
        return resultado;
    } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        throw error;
    }
}

async function atualizarImagem(novaBuffer, urlAntiga, pasta) {
    try {
        // Faz upload da nova imagem
        const novaImagem = await uploadImagem(novaBuffer, pasta);

        // Deleta a imagem antiga
        await deletarImagem(urlAntiga, pasta);

        return novaImagem;
    } catch (error) {
        console.error('Erro ao atualizar imagem:', error);
        throw error;
    }
}

module.exports = {
    uploadImagem,
    deletarImagem,
    atualizarImagem,
};
