const db = require("../config/db");

async function verificarEstabelecimento(req, res, next) {
    try {
        console.log("Middleware: verificarEstabelecimento");

        const id_estabelecimento = req.body.id_estabelecimento;
        const adminId = req.adminId;
        console.log(`verify estabelecimento: ${id_estabelecimento}`);
        if (!id_estabelecimento) {
            return res.status(400).json({ error: "id_estabelecimento não enviado no body" });
        }

        const query = `
            SELECT * FROM estabelecimento
            WHERE id = $1 AND id_admin = $2
        `;
        const { rows } = await db.query(query, [id_estabelecimento, adminId]);

        if (rows.length === 0) {
            return res.status(403).json({ error: "Este estabelecimento não pertence ao admin logado" });
        }
        console.log(`Last: ${id_estabelecimento}`);
        req.idEstabelecimento = id_estabelecimento;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports = verificarEstabelecimento;
