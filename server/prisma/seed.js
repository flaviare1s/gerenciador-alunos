import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cursos = [
  "Design",
  "Marketing",
  "Product",
  "Introdução ao Figma",
  "Full Stack",
  "Front End",
  "Back End",
  "UI/UX",
  "Banco de Dados",
  "Ciência de Dados",
  "DevOps",
];

const alunos = [
  {
    nome: "Olivia",
    sobrenome: "Rhye",
    estado: "Rio Grande do Sul",
    cursos: ["Design", "Marketing", "Product"],
  },
  {
    nome: "Phoenix",
    sobrenome: "Baker",
    estado: "Rio Grande do Sul",
    cursos: ["Design", "Marketing", "Product"],
  },
  {
    nome: "Lana",
    sobrenome: "Steiner",
    estado: "Rio Grande do Sul",
    cursos: ["Design", "Marketing", "Product"],
  },
  {
    nome: "Demi",
    sobrenome: "Wikinson",
    estado: "Rio Grande do Sul",
    cursos: ["Design", "Marketing", "Product"],
  },
  {
    nome: "Candice",
    sobrenome: "Wu",
    estado: "Bahia",
    cursos: ["Design", "Marketing", "Product", "Full Stack"],
  },
  {
    nome: "Natali",
    sobrenome: "Craig",
    estado: "Rio Grande do Sul",
    cursos: ["Design", "Marketing", "Product"],
  },
  {
    nome: "Drew",
    sobrenome: "Cano",
    estado: "Bahia",
    cursos: ["Design", "Marketing", "Product", "Full Stack", "Front End"],
  },
  {
    nome: "Orlando",
    sobrenome: "Diggs",
    estado: "Rio de Janeiro",
    cursos: [],
  },
  {
    nome: "Andi",
    sobrenome: "Lane",
    estado: "Santa Catarina",
    cursos: [],
  },
  {
    nome: "Kate",
    sobrenome: "Morrison",
    estado: "Rio Grande do Sul",
    cursos: [],
  },
];

async function main() {
  // Criar cursos
  for (const nome of cursos) {
    const existe = await prisma.curso.findUnique({ where: { nome } });
    if (!existe) {
      await prisma.curso.create({ data: { nome } });
      console.log(`Curso criado: ${nome}`);
    } else {
      console.log(`Curso já existe: ${nome}`);
    }
  }

  // Criar alunos e associar aos cursos
  for (const aluno of alunos) {
    const { nome, sobrenome, estado, cursos } = aluno;

    const novoAluno = await prisma.aluno.create({
      data: {
        nome,
        sobrenome,
        estado,
        email: `${nome.toLowerCase()}.${sobrenome.toLowerCase()}@example.com`,
        cpf: `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        genero: "Não especificado",
        cep: "00000-000",
        rua: "Rua Exemplo",
        numero: "123",
        pais: "Brasil",
      },
    });

    for (const cursoNome of cursos) {
      const curso = await prisma.curso.findUnique({
        where: { nome: cursoNome },
      });
      if (curso) {
        await prisma.alunoCurso.create({
          data: {
            alunoId: novoAluno.id,
            cursoId: curso.id,
            status: "EM_ANDAMENTO",
          },
        });
      }
    }

    console.log(`Aluno criado: ${nome} ${sobrenome}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
