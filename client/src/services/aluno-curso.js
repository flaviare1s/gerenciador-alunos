import { api } from "./api";

const handleRequest = async (request, errorMessage) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    console.error(`${errorMessage}:`, error.response || error.message);
    throw new Error(
      `${errorMessage}. Detalhes: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

export const getAllMatriculas = () =>
  handleRequest(() => api.get("/aluno-curso"), "Falha ao buscar matrículas");

export const getMatriculaById = (id) =>
  handleRequest(
    () => api.get(`/aluno-curso/${id}`),
    "Falha ao buscar matrícula"
  );

export const createMatricula = (matriculaData) =>
  handleRequest(
    () => api.post("/aluno-curso", matriculaData),
    "Falha ao criar matrícula"
  );

export const updateMatricula = (id, matriculaData) =>
  handleRequest(
    () => api.put(`/aluno-curso/${id}`, matriculaData),
    "Falha ao atualizar matrícula"
  );

export const deleteMatricula = (id) =>
  handleRequest(
    () => api.delete(`/aluno-curso/${id}`),
    "Falha ao deletar matrícula"
  );
