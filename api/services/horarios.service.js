const db = require("../config/db");


async function newHorarioForADay({ id_estabelecimento, id_profissional, dia, inicio, final, interval }) {
    const query = `SELECT * FROM gerar_horarios($1,$2,$3,$4,$5)`;
    const values = [dia, id_estabelecimento, id_profissional, inicio, final];
    console.log(values);
    const { rows } = await db.query(query, values);
    if (rows.length > 0 && rows[0].gerar_horarios === true) {
        return { success: true, message: "Horários gerados com sucesso" };
    } else {
        return { success: false, message: "Falha ao gerar horários" };
    }
}

module.exports = {
    newHorarioForADay
}