# Sistema de gerenciamento para barbearias

Sistema completo de gerenciamento para barbearias, com aplicativo mobile exclusivo para administradores e interface web voltada para os clientes.  

Este projeto foi desenvolvido por uma equipe de estudantes da UniFacimp como parte de uma avaliação acadêmica, com o objetivo de obter nota. Apesar disso, o sistema foi idealizado com foco em usabilidade real e possui potencial para aplicação comercial futura.  

Este projeto é uma versão ampliada e escalável de um protótipo anterior, que era voltado exclusivamente para web e focado apenas no front-end.

A versão original foi desenvolvida para atender um único barbeiro, enquanto esta nova versão foi repensada para suportar múltiplos estabelecimentos e oferecer uma estrutura completa de gerenciamento, com back-end robusto e aplicativo mobile para administradores.


## 🧰 Funcionalidades

- Cadastro de estabelecimentos
- Gerenciamento de profissionais
- Definição de horários e serviços
- Controle completo de agendamentos

## 📱 Visão geral

- O **aplicativo mobile** é voltado exclusivamente para o administrador do estabelecimento.
- Os **clientes realizam seus agendamentos através da versão web**, sem necessidade de autenticação.
- A API possui endpoints públicos para integração com a interface web.
- O gerenciamento completo do estabelecimento é realizado pelo administrador, autenticado via **JWT (JSON Web Token)**.
- Todas as ações administrativas estão protegidas por autenticação, garantindo segurança nas operações realizadas dentro do app.

## 🛠️ Tecnologias Utilizadas

- **Front-end:** Web(html,css,js), App(React Native)
- **Back-end:** Node.js (Express)
- **Banco de Dados:** PostgreSQL
- **Armazenamento de Imagens:** Cloudinary
- **Documentação da API:** [Acessar via Postman](link-do-postman-aqui)

# Inicialização
Clonar repositorio.
Banco de dados postgres: importar arquivo sql para criação das tabelas.
Nesta versão as imagens são armazenadas na nuvem cloudinary.
Criar conta no site(plano gratuito 1gb de armazenamento)
Criar arquivo .env com as configurações do seu banco de dados e as chaves da api da sua nuvem cloudinary.

HOST = 192.168.18.230 #Ip da maquina na rede o react native por ser inicializado em um dispositivo externo o localhost não funciona, é preciso integrar a api na mesma rede
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=agendafacil
DB_PASS=markim
DB_PORT=5432
JWT_SECRET=3h2k5k34b3jhjhf2f2c2lll
CLOUD_NAME = df83lvdun
CLOUD_API_KEY = 222578585336251
CLOUD_API_SECRET = NdRk8DoqAvnpdAvTBKhUX21DkvY


