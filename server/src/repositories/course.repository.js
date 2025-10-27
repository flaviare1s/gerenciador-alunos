import prisma from "../config/database.js";

export const createCourse = async (data) => {
  return await prisma.course.create({ data });
};

export const getCourses = async () => {
  return await prisma.course.findMany();
};

export const getCourseById = async (id) => {
  return await prisma.course.findUnique({ where: { id } });
};

export const updateCourse = async (id, data) => {
  return await prisma.course.update({ where: { id }, data });
};

export const deleteCourse = async (id) => {
  return await prisma.course.delete({ where: { id } });
};

export const getCourseByName = async (name) => {
  return await prisma.course.findUnique({
    where: { name },
  });
};
