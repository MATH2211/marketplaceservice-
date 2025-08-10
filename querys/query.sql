CREATE TABLE horarios (
    id SERIAL PRIMARY KEY,
    dia DATE NOT NULL,
    hora VARCHAR(4) NOT NULL CHECK (char_length(hora) <= 4),
    disponivel BOOLEAN DEFAULT true,
    id_estabelecimento INTEGER,
    id_profissional INTEGER NOT NULL,

    FOREIGN KEY (id_estabelecimento) REFERENCES estabelecimento(id),
    FOREIGN KEY (id_profissional) REFERENCES profissional(id),
    
    UNIQUE (dia, hora, id_profissional)
);