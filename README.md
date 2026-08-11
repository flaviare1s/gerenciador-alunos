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

## CI/CD e Imagens Docker

O projeto possui integração contínua via GitHub Actions em dois workflows:

- `client-ci.yml`: executa lint, testes e build do frontend.
- `server-ci.yml`: executa testes do backend com PostgreSQL em ambiente de CI.

As imagens Docker do projeto são publicadas no Docker Hub para uso em deploy:

- `flaviare1s/gerenciador-alunos-client`
- `flaviare1s/gerenciador-alunos-server`

Para gerar localmente as imagens, use:

```bash
docker build -t flaviare1s/gerenciador-alunos-client:latest ./client
docker build -t flaviare1s/gerenciador-alunos-server:latest ./server
```

Para publicar as imagens, crie a tag desejada e faça o push no Docker Hub.

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

### Documentação com Swagger

A documentação da API está disponível em:
[http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

### Documentação dos Componentes

- Todos os componentes no projeto possuem comentários diretamente no código.
- Esses comentários explicam o propósito do componente, as funcionalidades e o comportamento esperado.
- Para consultar a documentação de um componente específico, basta acessar o arquivo correspondente nas pastas `src/components` ou `src/pages`.

### Scripts do Banco de Dados

Os scripts do banco estão disponíveis na pasta `docs`. No entanto, não é necessário utilizá-los diretamente, pois o comando `npm run dev` já executa as migrations e seeds, criando e populando o banco automaticamente.

### Coleção do Insomnia

A coleção do Insomnia também está disponível na pasta `docs`.

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

### Cobertura de testes no backend

<img width="941" height="472" alt="testes-back" src="https://github.com/user-attachments/assets/b9184a88-b2e1-43d3-b58a-c0afa9d27cea" />

### Cobertura de testes no frontend

<img width="1066" height="487" alt="testes-front" src="https://github.com/user-attachments/assets/71bcbdd7-f9e5-46c3-b86d-2f3ef2968dfb" />

## Deploy

- **Banco de Dados**: Supabase
- **Back-end**: Vercel
- **Front-end**: Vercel

As imagens Docker do frontend e do backend também podem ser usadas em ambientes de deploy que aceitem containers.

Acesse o sistema em produção:
[https://gerenciador-alunos-beta.vercel.app/alunos](https://gerenciador-alunos-beta.vercel.app/alunos)
