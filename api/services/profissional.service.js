const db = require('../config/db');


async function postProfissionais({nome,celular,email,id_estabelecimento,imagem_url = null}) {
    const query = `insert into profissional (nome,celular,email,id_estabelecimento,disponivel,image_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`;
    const values = [nome,celular,email,id_estabelecimento,true,imagem_url];
    const {rows} = await db.query(query,values);
    return rows[0];
}


async function updateImagemProfissional({ id, id_estabelecimento, imagem_url }) {
    const query = `
        UPDATE profissional
        SET image_url = $1
        WHERE id = $2 AND id_estabelecimento = $3
        RETURNING *;
    `;
    const values = [imagem_url, id, id_estabelecimento];
    const { rows } = await db.query(query, values);
    return rows[0]; // retorna o serviço atualizado
}





module.exports = {
    postProfissionais,
    updateImagemProfissional
}