const db = require('../config/db');

async function postProfissionais({ nome, celular, email, id_estabelecimento, imagem_url = null }) {
    const query = `
        INSERT INTO profissional (nome, celular, email, id_estabelecimento, disponivel, image_url) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id;
    `;
    const values = [nome, celular, email, id_estabelecimento, true, imagem_url];
    const { rows } = await db.query(query, values);
    return rows[0];
}

async function getProfissionalById({ id, id_estabelecimento }) {
    const query = `
        SELECT * FROM profissional
        WHERE id = $1 AND id_estabelecimento = $2 and disponivel = true;
    `;
    const values = [id, id_estabelecimento];
    const { rows } = await db.query(query, values);
    return rows[0];
}

async function updateProfissional({ id, id_estabelecimento, nome, celular, email }) {
    const query = `
        UPDATE profissional
        SET nome = $1, celular = $2, email = $3
        WHERE id = $4 AND id_estabelecimento = $5
        RETURNING *;
    `;
    const values = [nome, celular, email, id, id_estabelecimento];
    const { rows } = await db.query(query, values);
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
    return rows[0];
}

async function deleteProfissional({ id, id_estabelecimento }) {
    const query = `
        DELETE FROM profissional
        WHERE id = $1 AND id_estabelecimento = $2
        RETURNING *;
    `;
    const values = [id, id_estabelecimento];
    const { rows } = await db.query(query, values);
    return rows[0];
}

async function getAllProfissionais(id_estabelecimento) {
    const query = `SELECT * FROM profissional WHERE id_estabelecimento = $1 and disponivel = TRUE`;
    const { rows } = await db.query(query, [id_estabelecimento]);
    return rows;
}

async function getAllProfissionaisPrivado(id_estabelecimento) {
  const query = `SELECT * FROM profissional WHERE id_estabelecimento = $1`;
  const { rows } = await db.query(query, [id_estabelecimento]);
  return rows;
}
module.exports = {
    postProfissionais,
    getProfissionalById,
    updateProfissional,
    updateImagemProfissional,
    deleteProfissional,
    getAllProfissionais,
    getAllProfissionaisPrivado
};
