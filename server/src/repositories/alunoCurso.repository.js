import prisma from "../config/database.js";

export const criarAlunoCurso = async (data) => {
  return await prisma.alunoCurso.create({ data });
  
};

export const listarAlunoCursos = async () => {
  return await prisma.alunoCurso.findMany({
    include: {
      aluno: true,
      curso: true,
    },
  });
};

export const buscarAlunoCursoPorId = async (id) => {
  return await prisma.alunoCurso.findUnique({
    where: { id },
    include: {
      aluno: true,
      curso: true,
    },
  });
};

export const atualizarAlunoCurso = async (id, data) => {
  return await prisma.alunoCurso.update({
    where: { id },
    data,
  });
};

export const deletarAlunoCurso = async (id) => {
  return await prisma.alunoCurso.delete({
    where: { id },
  });
};

export const buscarAlunoCursoPorAlunoECurso = async (alunoId, cursoId) => {
  return await prisma.alunoCurso.findUnique({
    where: {
      alunoId_cursoId: {
        alunoId,
        cursoId,
      },
    },
  });
};
