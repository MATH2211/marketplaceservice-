


create table imagens(
    id serial primary key,
    imagem_url varchar not null,
    tipo varchar(100),
    id_estabelecimento integer not null,
    foreign key (id_estabelecimento) references estabelecimento(id)
);