# LigAção - Plataforma de Gestão de Voluntariado 🤝

A **LigAção** é uma plataforma web desenvolvida para conectar Instituições Não Governamentais (ONGs) a cidadãos dispostos a fazer voluntariado. Desenvolvida com a Stack MERN, oferece uma interface dedicada para gestão de vagas e candidaturas (ONGs) e um portal interativo para descoberta de oportunidades (Voluntários).

---

## 🛠️ Tecnologias Utilizadas

* **Base de Dados:** MongoDB (Atlas)
* **Backend:** Node.js com Express
* **Frontend:** React.js (com Vite)
* **Autenticação:** JSON Web Tokens (JWT)

---

## 📋 Pré-requisitos

Antes de começares, certifica-te de que tens as seguintes ferramentas instaladas no teu sistema:

* [Node.js](https://nodejs.org/) (versão 16.x ou superior)
* [npm](https://www.npmjs.com/) (geralmente instalado com o Node.js)
* Uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (ou o MongoDB a correr localmente)

---

## ⚙️ Instalação e Configuração

O projeto está dividido em duas partes: `backend` e `frontend`. Terás de configurar e iniciar ambas.

### 1. Clonar o Repositório

```bash
git clone [https://github.com/O_TEU_NOME_DE_UTILIZADOR/ligacao.git](https://github.com/O_TEU_NOME_DE_UTILIZADOR/ligacao.git)
cd ligacao
2. Configuração do Backend
Abre um terminal e navega para a pasta do servidor:
Bash
cd backend
npm install
Cria um ficheiro chamado .env na raiz da pasta backend e adiciona as seguintes variáveis de ambiente:
Fragmento do código
# Porta onde o servidor vai correr
PORT=5000

# URI de ligação à base de dados MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ligacao?retryWrites=true&w=majority

# Chave secreta para a geração dos tokens JWT
JWT_SECRET=A_TUA_CHAVE_SECRETA_AQUI
Inicia o servidor em modo de desenvolvimento:
Bash
npm run dev
# O servidor deverá iniciar na porta 5000 (ex: http://localhost:5000)
3. Configuração do Frontend
Abre um novo terminal (mantendo o do backend a correr) e navega para a pasta do cliente:
Bash
cd frontend
npm install
(Opcional) Se usares variáveis de ambiente no frontend (ex: URL da API), cria um ficheiro .env na pasta frontend:
Fragmento do código
VITE_API_URL=http://localhost:5000/api
Inicia a aplicação React:
Bash
npm run dev
# O frontend deverá iniciar geralmente em http://localhost:5173
🔑 Credenciais de Teste
Para facilitar a avaliação e o teste da plataforma, a base de dados já se encontra configurada com contas de demonstração para ambos os perfis.
Acesso Instituição (ONG):
E-mail: ong@teste.pt
Password: TesteOng2026
Acesso Voluntário:
E-mail: voluntario@teste.pt
Password: TesteVoluntario2026
🚀 Funcionalidades Principais
Registo e Autenticação Dinâmica: Redirecionamento condicionado ao tipo de perfil criado (ONG ou Voluntário).
Dashboard ONG: Gestão CRUD de oportunidades, aceitação/rejeição de candidaturas e KPIs dinâmicos.
Dashboard Voluntário: Catálogo de vagas, sistema de favoritos e acompanhamento do estado das candidaturas.
Sistema de Metas: Cálculo em tempo real do preenchimento das vagas e fecho automático quando a meta de voluntários é atingida.
Totalmente Responsivo: Abordagem Mobile-First, garantindo uma excelente experiência em qualquer dispositivo.
