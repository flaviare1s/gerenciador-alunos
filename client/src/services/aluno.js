import { api } from "./api";

const handleRequest = async (request, errorMessage) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw new Error(`${errorMessage}. Por favor, tente novamente.`);
  }
};

export const getAllAlunos = () =>
  handleRequest(() => api.get("/alunos"), "Falha ao buscar alunos");

export const getAlunoById = (id) =>
  handleRequest(() => api.get(`/alunos/${id}`), "Falha ao buscar aluno");

export const createAluno = (alunoData) =>
  handleRequest(() => api.post("/alunos", alunoData), "Falha ao criar aluno");

export const updateAluno = (id, alunoData) =>
  handleRequest(
    () => api.put(`/alunos/${id}`, alunoData),
    "Falha ao atualizar aluno"
  );

export const deleteAluno = (id) =>
  handleRequest(() => api.delete(`/alunos/${id}`), "Falha ao deletar aluno");
