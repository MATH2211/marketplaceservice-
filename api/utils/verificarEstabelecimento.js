const db = require("../config/db");

async function verificarEstabelecimento(req, res, next) {
    try {
        console.log("Mid: verificar Estabelecimento");
        console.log(req.params);
        const id_estabelecimento = req.body.id_estabelecimento || req.params.id_estabelecimento;
        const adminId = req.adminId;
        console.log(id_estabelecimento)
        const query = `
            SELECT * FROM estabelecimento
            WHERE id = $1 AND id_admin = $2
        `;
        const { rows } = await db.query(query, [id_estabelecimento, adminId]);

        if (rows.length === 0) {
            return res.status(403).json({ error: "Este estabelecimento não pertence ao admin logado" });
        }

        req.idEstabelecimento = id_estabelecimento;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = verificarEstabelecimento;
