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

export const getAllCourses = () =>
  handleRequest(() => api.get("/cursos"), "Falha ao buscar cursos");

export const getCourseById = (id) =>
  handleRequest(() => api.get(`/cursos/${id}`), "Falha ao buscar curso");

export const createCourse = (courseData) =>
  handleRequest(
    () => api.post("/cursos", courseData),
    "Falha ao criar curso"
  );

export const updateCourse = (id, courseData) =>
  handleRequest(
    () => api.put(`/cursos/${id}`, courseData),
    "Falha ao atualizar curso"
  );

export const deleteCourse = (id) =>
  handleRequest(() => api.delete(`/cursos/${id}`), "Falha ao deletar curso");
