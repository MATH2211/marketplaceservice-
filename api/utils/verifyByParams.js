const db = require("../config/db")

async function verificarEstabelecimentoPorParams(req, res, next) {
    try {
        console.log("Mid: verificarEstabelecimentoPorParams"); 
        const id_estabelecimento = req.params.id_estabelecimento;
        console.log(`id_estabelecimento: ${id_estabelecimento}`);
        const adminId = req.adminId;
        console.log(`adminId: ${adminId}`);

        if (!id_estabelecimento) {
            return res.status(400).json({ error: "ID do estabelecimento não fornecido nos parâmetros." });
        }

        const query = `
            SELECT * FROM estabelecimento
            WHERE id = $1 AND id_admin = $2
        `;
        const { rows } = await db.query(query, [id_estabelecimento, adminId]);

        if (rows.length === 0) {
            return res.status(403).json({ error: "Este estabelecimento não pertence ao admin logado." });
        }

        req.idEstabelecimento = id_estabelecimento;
        console.log(`Até aqui funcionou: ${req.idEstabelecimento}`);
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = verificarEstabelecimentoPorParams;