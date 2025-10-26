import * as alunoRepository from "../repositories/aluno.repository.js";
import { alunoSchema } from "../validations/aluno.validation.js";
import prisma from "../config/database.js";

export const criarAluno = async (data) => {
  const { error } = alunoSchema.validate(data, { abortEarly: false });
  if (error) {
    throw {
      type: "validation",
      mensagem: "Erro de validação",
      erros: error.details.map((d) => d.message),
    };
  }

  return await alunoRepository.criarAluno(data);
};

export const listarAlunos = async () => {
  const alunos = await prisma.aluno.findMany({
    include: {
      cursos: {
        include: {
          curso: true,
        },
      },
    },
  });

  const alunosComCursos = alunos.map((aluno) => ({
    ...aluno,
    cursos: aluno.cursos.map((alunoCurso) => alunoCurso.curso.nome),
  }));

  return alunosComCursos;
};

export const buscarAlunoPorId = async (id) => {
  const aluno = await prisma.aluno.findUnique({
    where: { id },
    include: {
      cursos: {
        include: {
          curso: true,
        },
      },
    },
  });

  if (!aluno) {
    throw {
      type: "not_found",
      mensagem: "Aluno não encontrado",
    };
  }

  return {
    ...aluno,
    cursos: aluno.cursos.map((alunoCurso) => alunoCurso.curso.nome),
  };
};

export const atualizarAluno = async (id, data) => {
  await buscarAlunoPorId(id);
  const alunoAtualizado = await prisma.aluno.update({
    where: { id },
    data,
    include: {
      cursos: {
        include: {
          curso: true,
        },
      },
    },
  });

  return {
    ...alunoAtualizado,
    cursos: alunoAtualizado.cursos.map((alunoCurso) => alunoCurso.curso.nome),
  };
};

export const deletarAluno = async (id) => {
  await buscarAlunoPorId(id);
  await prisma.alunoCurso.deleteMany({ where: { alunoId: id } }); // 
  return await prisma.aluno.delete({ where: { id } });
};
