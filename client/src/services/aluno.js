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

export const getAllCursos = () =>
  handleRequest(() => api.get("/cursos"), "Falha ao buscar cursos");

export const getCursoById = (id) =>
  handleRequest(() => api.get(`/cursos/${id}`), "Falha ao buscar curso");

export const createCurso = (cursoData) =>
  handleRequest(() => api.post("/cursos", cursoData), "Falha ao criar curso");

export const updateCurso = (id, cursoData) =>
  handleRequest(
    () => api.put(`/cursos/${id}`, cursoData),
    "Falha ao atualizar curso"
  );

export const deleteCurso = (id) =>
  handleRequest(() => api.delete(`/cursos/${id}`), "Falha ao deletar curso");

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
