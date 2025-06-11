const horariosService = require('../services/horarios.service');


async function postNewHorario(req,res) {
    try {
        // Pegando os valores do req (middleware deve ter colocado)
        const id_estabelecimento = req.idEstabelecimento;
        const id_profissional = req.idProfissional;

        // Outros parâmetros podem vir do body (ex: dia, inicio, final, interval)
        const { dia, inicio, final, interval } = req.body;

        const resultado = await horariosService.newHorarioForADay({
            id_estabelecimento,
            id_profissional,
            dia,
            inicio,
            final,
            interval
        });

        return res.status(200).json(resultado);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }       
}


module.exports = {
    postNewHorario
}