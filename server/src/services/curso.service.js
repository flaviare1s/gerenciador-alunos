import * as cursoRepository from "../repositories/curso.repository.js";
import { cursoSchema } from "../validations/curso.validation.js";

export const criarCurso = async (data) => {
  const { error } = cursoSchema.validate(data, { abortEarly: false });
  if (error) {
    throw {
      type: "validation",
      mensagem: "Erro de validação",
      erros: error.details.map((d) => d.message),
    };
  }

  const cursoExistente = await cursoRepository.buscarCursoPorNome(data.nome);
  if (cursoExistente) {
    throw {
      type: "conflict",
      mensagem: "Curso já existe",
    };
  }

  return await cursoRepository.criarCurso(data);
};

export const listarCursos = async () => {
  return await cursoRepository.listarCursos();
};

export const buscarCursoPorId = async (id) => {
  const curso = await cursoRepository.buscarCursoPorId(id);
  if (!curso) {
    throw {
      type: "not_found",
      mensagem: "Curso não encontrado",
    };
  }
  return curso;
};

export const atualizarCurso = async (id, data) => {
  await buscarCursoPorId(id);
  return await cursoRepository.atualizarCurso(id, data);
};

export const deletarCurso = async (id) => {
  await buscarCursoPorId(id);
  return await cursoRepository.deletarCurso(id);
};
