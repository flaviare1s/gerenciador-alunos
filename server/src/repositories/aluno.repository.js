import prisma from "../config/database.js";

export const criarAluno = async (data) => {
  return await prisma.aluno.create({ data });
};

export const listarAlunos = async () => {
  return await prisma.aluno.findMany();
};

export const buscarAlunoPorId = async (id) => {
  return await prisma.aluno.findUnique({ where: { id } });
};

export const buscarAlunoComCursosPorId = async (id) => {
  return await prisma.aluno.findUnique({
    where: { id },
    include: {
      cursos: {
        include: {
          curso: true,
        },
      },
    },
  });
};

export const atualizarAluno = async (id, data) => {
  return await prisma.aluno.update({ where: { id }, data });
};

export const deletarAluno = async (id) => {
  return await prisma.aluno.delete({ where: { id } });
};

export const listarAlunosComCursos = async () => {
  return await prisma.aluno.findMany({
    include: {
      cursos: {
        select: {
          curso: {
            select: {
              nome: true,
            },
          },
          status: true,
          dataConclusao: true,
        },
      },
    },
  });
};
