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

async function getServices({id_estabelecimento}) {
    console.log(`id: ${id_estabelecimento}`);
    const query = `
        SELECT * FROM servicos where id_estabelecimento = $1
    `
    const values = [id_estabelecimento];
    console.log(`values: ${values}`);
    const {rows} = await db.query(query,values);
    return rows;
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

async function deleteService({ id_estabelecimento, id_servico }) {
    const query = `
        DELETE FROM servicos 
        WHERE id_estabelecimento = $1 AND id = $2
        RETURNING *;
    `;
    const values = [id_estabelecimento, id_servico];

    const { rows } = await db.query(query, values);
    return rows[0]; // Se for undefined, significa que não encontrou
}
module.exports = {
    newServico,
    updateImagemServico,
    getServices,
    deleteService
};