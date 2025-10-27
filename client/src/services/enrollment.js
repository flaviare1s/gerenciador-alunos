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

export const getAllEnrollments = () =>
  handleRequest(() => api.get("/matriculas"), "Falha ao buscar matrículas");

export const getEnrollmentById = (id) =>
  handleRequest(
    () => api.get(`/matriculas/${id}`),
    "Falha ao buscar matrícula"
  );

export const createEnrollment = (enrollmentData) =>
  handleRequest(
    () => api.post("/matriculas", enrollmentData),
    "Falha ao criar matrícula"
  );

export const updateEnrollment = (id, enrollmentData) =>
  handleRequest(
    () => api.put(`/matriculas/${id}`, enrollmentData),
    "Falha ao atualizar matrícula"
  );

export const deleteEnrollment = (id) =>
  handleRequest(
    () => api.delete(`/matriculas/${id}`),
    "Falha ao deletar matrícula"
  );
