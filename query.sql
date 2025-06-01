SELECT i.*
FROM imagens i
JOIN estabelecimento e ON i.id_estabelecimento = e.id
WHERE e.id_admin = 14
AND i.tipo = 'logo';