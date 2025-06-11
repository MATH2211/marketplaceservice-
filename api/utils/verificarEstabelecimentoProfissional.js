const db = require("../config/db");

async function verificarEstabelecimentoProfissional(req, res, next) {
    try {
        console.log("Middleware: verificarEstabelecimentoProfissional");

        const { id_estabelecimento, id_profissional } = req.body;
        const adminId = req.adminId;

        if (!id_estabelecimento) {
            return res.status(400).json({ error: "id_estabelecimento não enviado no body" });
        }

        if (!id_profissional) {
            return res.status(400).json({ error: "id_profissional não enviado no body" });
        }

        // Verifica se o estabelecimento pertence ao admin
        const queryEstab = `
            SELECT * FROM estabelecimento
            WHERE id = $1 AND id_admin = $2
        `;
        const { rows: estabRows } = await db.query(queryEstab, [id_estabelecimento, adminId]);
        if (estabRows.length === 0) {
            return res.status(403).json({ error: "Este estabelecimento não pertence ao admin logado" });
        }

        // Verifica se o profissional pertence ao estabelecimento
        const queryProf = `
            SELECT * FROM profissional
            WHERE id = $1 AND id_estabelecimento = $2
        `;
        const { rows: profRows } = await db.query(queryProf, [id_profissional, id_estabelecimento]);
        if (profRows.length === 0) {
            return res.status(403).json({ error: "Profissional não pertence a este estabelecimento" });
        }

        req.idEstabelecimento = id_estabelecimento;
        req.idProfissional = id_profissional;

        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = verificarEstabelecimentoProfissional;
