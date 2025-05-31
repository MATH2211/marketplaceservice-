const db = require('../config/db');

async function verifyEstabelecimento(req, res, next) {
  const { id_estabelecimento } = req.body;
  const adminId = req.adminId;

  if (!id_estabelecimento) {
    return res.status(400).json({ error: 'id_estabelecimento não fornecido' });
  }

  try {
    const query = `
      SELECT * FROM estabelecimento
      WHERE id = $1 AND id_admin = $2
    `;
    const values = [id_estabelecimento, adminId];

    const { rows } = await db.query(query, values);

    if (rows.length === 0) {
      return res.status(403).json({ error: 'Estabelecimento não pertence a este admin' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro na verificação do estabelecimento' });
  }
}

module.exports = verifyEstabelecimento;
