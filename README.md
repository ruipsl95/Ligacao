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
git clone [https://github.com/ruipsl95/Ligacao.git](https://github.com/ruipsl95/Ligacao.git)
cd Ligacao
```

### 2. Configuração do Backend

Abre um terminal e navega para a pasta do servidor:

```bash
cd backend
npm install
```

Inicia o servidor em modo de desenvolvimento:

```bash
npm run dev
# O servidor deverá iniciar na porta 5000 (ex: http://localhost:5000)
```

### 3. Configuração do Frontend

Abre um **novo** terminal (mantendo o do backend a correr) e navega para a pasta do cliente:

```bash
cd frontend
npm install
```

Inicia a aplicação React:

```bash
npm run dev
# O frontend deverá iniciar geralmente em http://localhost:5173
```

---

## 🔑 Credenciais de Teste

Para facilitar a avaliação e o teste da plataforma, a base de dados já se encontra configurada com contas de demonstração para ambos os perfis.

**Acesso Instituição (ONG):**
* **E-mail:** `ong@teste.pt`
* **Password:** `TesteOng2026`

**Acesso Voluntário:**
* **E-mail:** `voluntario@teste.pt`
* **Password:** `TesteVoluntario2026`

---

## 🚀 Funcionalidades Principais

* **Registo e Autenticação Dinâmica:** Redirecionamento condicionado ao tipo de perfil criado (ONG ou Voluntário).
* **Dashboard ONG:** Gestão CRUD de oportunidades, aceitação/rejeição de candidaturas e KPIs dinâmicos.
* **Dashboard Voluntário:** Catálogo de vagas, sistema de favoritos e acompanhamento do estado das candidaturas.
* **Sistema de Metas:** Cálculo em tempo real do preenchimento das vagas e fecho automático quando a meta de voluntários é atingida.
* **Totalmente Responsivo:** Abordagem Mobile-First, garantindo uma excelente experiência em qualquer dispositivo.
