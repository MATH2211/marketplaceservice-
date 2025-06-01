

/*
create table imagens(
    id serial primary key,
    imagem_url varchar not null,
    tipo varchar(100),
    id_estabelecimento integer not null,
    foreign key (id_estabelecimento) references estabelecimento(id)
);
*/

create table servicos(
    id serial primary key,
    nome varchar(100) not null,
    valor decimal(5,2) not null,
    tempo integer not null,
    id_estabelecimento integer not null,
    imagem_url varchar default null,
    foreign key (id_estabelecimento) references estabelecimento(id) on delete cascade
);