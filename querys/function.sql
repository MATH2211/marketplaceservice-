CREATE OR REPLACE FUNCTION gerar_horarios(
    dia_input DATE,
    id_estab INTEGER,
    id_prof INTEGER,
    hora_inicio_texto VARCHAR(4),
    hora_fim_texto VARCHAR(4)
)
RETURNS BOOLEAN AS $$
DECLARE
    hora_inicio TIME := to_timestamp(hora_inicio_texto, 'HH24MI')::TIME;
    hora_fim TIME := to_timestamp(hora_fim_texto, 'HH24MI')::TIME;
    hora_atual TIME := hora_inicio;
    hora_texto VARCHAR(4);
BEGIN
    WHILE hora_atual <= hora_fim LOOP
        hora_texto := to_char(hora_atual, 'HH24MI');

        INSERT INTO horarios (dia, hora, disponivel, id_estabelecimento, id_profissional)
        VALUES (dia_input, hora_texto, true, id_estab, id_prof);

        hora_atual := hora_atual + INTERVAL '30 minutes';
    END LOOP;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION gerar_horarios_semana(
    dia_inicio DATE,
    id_estab INTEGER,
    id_prof INTEGER,
    hora_inicio_texto VARCHAR(4),
    hora_fim_texto VARCHAR(4)
)
RETURNS void AS $$
DECLARE
    i INT;
    dia_atual DATE;
BEGIN
    FOR i IN 0..6 LOOP
        dia_atual := dia_inicio + i;

        BEGIN
            PERFORM gerar_horarios(dia_atual, id_estab, id_prof, hora_inicio_texto, hora_fim_texto);
        EXCEPTION WHEN OTHERS THEN
            -- Ignora erro de um dia e continua com os demais
            RAISE NOTICE 'Erro ao gerar horários para o dia %, pulando...', dia_atual;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

