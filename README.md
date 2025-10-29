# Sistema de Gerenciamento de Cursos e Alunos

## Visão Geral do Projeto

Este sistema permite gerenciar cursos e alunos, oferecendo funcionalidades para criar, visualizar, editar e deletar cursos e alunos, além de associar alunos a cursos específicos.

## Tecnologias Utilizadas

### Front-end

- **React**
- **Tailwind CSS**
- **Axios**

### Back-end

- **Node.js**
- **Express**
- **Prisma**
- **Swagger** (para documentação da API)

### Banco de Dados

- **PostgreSQL**

## Funcionalidades

### Front-end

- Filtro de pesquisa para alunos e cursos.
- Listagem de alunos e cursos cadastrados.
- Tabelas com ações (deletar/editar) para cada linha.
- Interface para adicionar e editar alunos e cursos.
- Tela de detalhamento do aluno, permitindo inclusão/atualização de informações.
- Integração com a API ViaCEP para preenchimento automático de campos de localização.
- Associação de alunos a cursos:
  - Inclusão de cursos concluídos e em andamento.

### Back-end

1. **API**:

   - Endpoints REST para operações de CRUD de cursos, alunos e matrículas.
   - Endpoint para vincular/desvincular alunos a cursos.
   - Validações para garantir a integridade dos dados recebidos.

2. **Banco de Dados**:
   - Armazenamento de dados de cursos e alunos, incluindo associações (matrículas).

## Como Rodar o Projeto

### Backend

1. Entre na pasta `server`:
   ```bash
   cd server
   ```
2. Crie o banco de dados no PostgreSQL (exemplo: `escola_db`). Certifique-se de que o nome do banco está compatível com o arquivo `.env`.
3. Copie o arquivo `.env.example` e renomeie para `.env`, ajustando as credenciais (usuário, senha e nome do banco).
4. Instale as dependências:
   ```bash
   npm install
   ```
5. Execute o comando para iniciar o servidor e criar as tabelas e seeds no banco:
   ```bash
   npm run dev
   ```
6. Para rodar apenas o servidor:
   ```bash
   npm start
   ```

### Frontend

1. Entre na pasta `client`:
   ```bash
   cd client
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo `.env.example` e renomeie para `.env`.
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse o sistema no navegador pelo link gerado pelo servidor de desenvolvimento.

## Documentação

### Scripts do Banco de Dados

Os scripts do banco estão disponíveis na pasta `docs`. No entanto, não é necessário utilizá-los diretamente, pois o comando `npm run dev` já executa as migrations e seeds, criando e populando o banco automaticamente.

### Coleção do Insomnia

A coleção do Insomnia também está disponível na pasta `docs`.

### Documentação com Swagger

A documentação da API está disponível em:
[http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

## Testes

- Os testes foram feitos em um ambiente separado (branch test).
- **Back-end**:
  - **Jest**: Framework de testes para JavaScript.
  - **Supertest**: Biblioteca para testar endpoints HTTP.
  - **Cross-env**: Ferramenta para definir variáveis de ambiente de forma consistente entre sistemas operacionais.
- **Front-end**:
  - **Vitest**: Framework de testes para aplicações modernas.
  - **Jsdom**: Simula um ambiente de navegador para testes.
  - **Vitest/coverage-v8**: Gera relatórios de cobertura de código.
  - **Vitest/ui**: Interface gráfica para visualizar os testes.

## Deploy

- **Banco de Dados**: Supabase
- **Back-end**: Render
- **Front-end**: Vercel

Acesse o sistema em produção:
[https://gerenciador-alunos-beta.vercel.app/alunos](https://gerenciador-alunos-beta.vercel.app/alunos)
