# Sistema de Gerenciamento de courses e students

## Visão Geral do Projeto

Módulo de sistema para gerenciar courses e students, permitindo criar, visualizar, editar e deletar courses e students, bem como associar students a courses específicos.

## Tecnologias

### Front-end

- React
- Tailwind
- Axios

### Back-end

- Node.js
- Express
- Prisma

### Banco de dados

- PostgreSQL

## Front-end:

1. Funcionalidades:

- Filtro de pesquisa de student
- Listagem de students
- Tabela com lista de students cadastrados
- Botão de ação a cada linha da tabela (deletar / editar)
- Interface para adicionar e editar students.
- Ao optar por adicionar um novo student ou detalhar o student já cadastrado, deve abrir uma tela de detalhamento do student para que possam ser incluídas/atualizadas informações.
- Integrar com alguma api de CEP's para auto preenchimento dos campos adicionais de localização.
- Associação de students a courses:
- Permitir que sejam adicionados courses que o student concluiu e também courses em andamento.

## Back-end:

1. API:

- Endpoints REST para operações de CRUD de courses e students.
- Endpoint para vincular/desvincular students a courses.
- Validações para garantir que os dados sejam recebidos corretamente pela API.

2. Banco de Dados:

- Para armazenar os dados dos courses e dos students, incluindo as associações entre eles.
