import * as courseRepository from "../repositories/course.repository.js";
import { courseSchema } from "../validations/course.validation.js";

export const createCourse = async (data) => {
  const { error } = courseSchema.validate(data, { abortEarly: false });
  if (error) {
    throw {
      type: "validation",
      mensagem: "Erro de validação",
      erros: error.details.map((d) => d.message),
    };
  }

  const courseExistente = await courseRepository.getCourseByName(data.name);
  if (courseExistente) {
    throw {
      type: "conflict",
      mensagem: "Curso já existe",
    };
  }

  return await courseRepository.createCourse(data);
};

export const getCourses = async () => {
  return await courseRepository.getCourses();
};

export const getCourseById = async (id) => {
  const course = await courseRepository.getCourseById(id);
  if (!course) {
    throw {
      type: "not_found",
      mensagem: "Curso não encontrado",
    };
  }
  return course;
};

export const updateCourse = async (id, data) => {
  await getCourseById(id);
  return await courseRepository.updateCourse(id, data);
};

export const deleteCourse = async (id) => {
  await getCourseById(id);
  return await courseRepository.deleteCourse(id);
};
