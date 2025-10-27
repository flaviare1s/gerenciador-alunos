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

export const getAllStudents = () =>
  handleRequest(() => api.get("/alunos"), "Falha ao buscar alunos");

export const getStudentById = (id) =>
  handleRequest(() => api.get(`/alunos/${id}`), "Falha ao buscar aluno");

export const createStudent = (studentData) =>
  handleRequest(
    () => api.post("/alunos", studentData),
    "Falha ao criar aluno"
  );

export const updateStudent = (id, studentData) =>
  handleRequest(
    () => api.put(`/alunos/${id}`, studentData),
    "Falha ao atualizar aluno"
  );

export const deleteStudent = (id) =>
  handleRequest(
    () => api.delete(`/alunos/${id}`),
    "Falha ao deletar aluno"
  );
