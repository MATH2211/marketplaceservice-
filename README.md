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

## 🛠️ Tecnologias Utilizadas

- **Front-end:**  
  - Web: HTML, CSS, JavaScript  
  - App: React Native

- **Back-end:**  
  - Node.js (Express)

- **Banco de Dados:**  
  - PostgreSQL

- **Armazenamento de Imagens:**  
  - Cloudinary

- **Documentação da API:**  
  - [Acessar via Postman](link-do-postman-aqui)

---

# 🚀 Inicialização do Projeto

### 1. Clonar o repositório  
```bash
git clone <url-do-repositorio>
2. Configuração do Banco de Dados (PostgreSQL)
Criar o banco de dados.

Importar o arquivo .sql fornecido para criação das tabelas.

3. Configuração do Cloudinary (armazenamento de imagens)
As imagens são armazenadas na nuvem Cloudinary nesta versão.

Criar uma conta gratuita (1 GB de armazenamento) em:
https://cloudinary.com

4. Configurar arquivo .env
Na raiz do projeto, editar o arquivo .env.

Preencher as variáveis com os dados do seu banco de dados e as chaves da API do Cloudinary.


