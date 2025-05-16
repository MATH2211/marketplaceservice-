const pool = require('../config/db');

async function criarEstabelecimento({ nome, endereco }, adminId) {
    const result = await pool.query(
        'INSERT INTO estabelecimento (nome, endereco, id_admin) VALUES ($1, $2, $3) RETURNING *',
        [nome, endereco, adminId]
    );
    return result.rows[0];
}

async function listarEstabelecimentos(adminId) {
    const result = await pool.query(
        'SELECT * FROM estabelecimento WHERE id_admin = $1',
        [adminId]
    );
    return result.rows;
}

async function deletarEstabelecimento(id, adminId) {
    // Verifica se o estabelecimento pertence a este administrador
    const verif = await pool.query(
        'SELECT * FROM estabelecimento WHERE id = $1 AND id_admin = $2',
        [id, adminId]
    );
    if (verif.rows.length === 0) throw new Error('Estabelecimento não encontrado ou acesso negado');

    await pool.query('DELETE FROM estabelecimento WHERE id = $1', [id]);
    return { message: 'Estabelecimento deletado com sucesso' };
}

module.exports = {
    criarEstabelecimento,
    listarEstabelecimentos,
    deletarEstabelecimento
};