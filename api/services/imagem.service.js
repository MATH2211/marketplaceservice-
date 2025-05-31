const db = require('../config/db'); // conexão com o banco

async function salvarImagem({ imagem_url, tipo = 'logo', id_estabelecimento }) {
  const query = `
    INSERT INTO imagens (imagem_url, tipo, id_estabelecimento)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [imagem_url, tipo, id_estabelecimento];

  const { rows } = await db.query(query, values);
  return rows[0];
}


/*
async function listImagens(id_estabelecimento) {
    const query = `select * from imagens where id_estabelecimento = ($1)`;
    const values = [id_estabelecimento];
    const {rows} = await db.query(query,values);
    return rows;
}
*/

async function listarImagensPorEstabelecimento(id_estabelecimento) {
  const query = `
    SELECT id, imagem_url, tipo
    FROM imagens
    WHERE id_estabelecimento = $1;
  `;
  const values = [id_estabelecimento];
  const { rows } = await db.query(query, values);
  return rows;
}

async function getLogoByIdAdmin(id_admin) {
  const query = `
  SELECT i.* 
  FROM imagens i 
  JOIN estabelecimento e ON i.id_estabelecimento = e.id
  WHERE e.id_admin = $1
  AND i.tipo = 'logo';
`
  const values = [id_admin];
  const { rows } = await db.query(query, values);
  return rows;
}



module.exports = {
  salvarImagem,
  listarImagensPorEstabelecimento,
  getLogoByIdAdmin
};