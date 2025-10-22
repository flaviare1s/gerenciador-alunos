import * as alunoRepository from "../repositories/aluno.repository.js";
import { alunoSchema } from "../validations/aluno.validation.js";


export const criarAluno = async (data) => {
  const { error } = alunoSchema.validate(data);
  if (error) throw new Error(`Erro de validação: ${error.message}`);

  return await alunoRepository.criarAluno(data);
};

export const listarAlunos = async () => {
  return await alunoRepository.listarAlunos();
};

export const buscarAlunoPorId = async (id) => {
  const aluno = await alunoRepository.buscarAlunoPorId(id);
  if (!aluno) throw new Error("Aluno não encontrado");
  return aluno;
};

export const atualizarAluno = async (id, data) => {
  await buscarAlunoPorId(id);
  return await alunoRepository.atualizarAluno(id, data);
};

export const deletarAluno = async (id) => {
  await buscarAlunoPorId(id);
  return await alunoRepository.deletarAluno(id);
};
