import prisma from "../config/database.js";

export const criarCurso = async (data) => {
  return await prisma.curso.create({ data });
};

export const listarCursos = async () => {
  return await prisma.curso.findMany();
};

export const buscarCursoPorId = async (id) => {
  return await prisma.curso.findUnique({ where: { id } });
};

export const atualizarCurso = async (id, data) => {
  return await prisma.curso.update({ where: { id }, data });
};

export const deletarCurso = async (id) => {
  return await prisma.curso.delete({ where: { id } });
};

export const buscarCursoPorNome = async (nome) => {
  return await prisma.curso.findUnique({
    where: { nome },
  });
};
