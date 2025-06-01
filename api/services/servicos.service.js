const db = require("../config/db");


async function newServico({nome,valor,tempo,id_estabelecimento, imagem_url = null}) {
    const query = `
        INSERT INTO servicos (nome,valor,tempo,id_estabelecimento,imagem_url)
        VALUES ($1,$2,$3,$4,$5) RETURNING id
    `
    const values = [nome,valor,tempo,id_estabelecimento,imagem_url];
    const {rows} = await db.query(query,values);
    return rows[0];
}

async function updateImagemServico({ id, id_estabelecimento, imagem_url }) {
    const query = `
        UPDATE servicos
        SET imagem_url = $1
        WHERE id = $2 AND id_estabelecimento = $3
        RETURNING *;
    `;
    const values = [imagem_url, id, id_estabelecimento];
    const { rows } = await db.query(query, values);
    return rows[0]; // retorna o serviço atualizado
}


module.exports = {
    newServico,
    updateImagemServico
};