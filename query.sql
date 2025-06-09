create table profissional (
    id serial primary key,
    nome varchar not null,
    celular varchar,
    email varchar,
    disponivel boolean default TRUE,
    id_estabelecimento integer,
    image_url varchar null,
    foreign key (id_estabelecimento) REFERENCES estabelecimento(id)
);