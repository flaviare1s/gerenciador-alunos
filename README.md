# Sistema de Gerenciamento de Cursos e Alunos

## Visão Geral do Projeto

Módulo de sistema para gerenciar cursos e alunos, permitindo criar, visualizar, editar e deletar cursos e alunos, bem como associar alunos a cursos específicos.

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
- Filtro de pesquisa de aluno
- Listagem de alunos
- Tabela com lista de alunos cadastrados
- Botão de ação a cada linha da tabela (deletar / editar)
- Interface para adicionar e editar alunos.
- Ao optar por adicionar um novo aluno ou detalhar o aluno já cadastrado, deve abrir uma tela de detalhamento do aluno para que possam ser incluídas/atualizadas informações.
- Integrar com alguma api de CEP's para auto preenchimento dos campos adicionais de localização.
- Associação de Alunos a Cursos:
- Permitir que sejam adicionados cursos que o aluno concluiu e também cursos em andamento.

## Back-end:
1. API:
- Endpoints REST para operações de CRUD de cursos e alunos.
- Endpoint para vincular/desvincular alunos a cursos.
- Validações para garantir que os dados sejam recebidos corretamente pela API.

2. Banco de Dados:
- Para armazenar os dados dos cursos e dos alunos, incluindo as associações entre eles.
