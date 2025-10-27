import prisma from "../config/database.js";

export const createStudent = async (data) => {
  return await prisma.student.create({ data });
};

export const getStudents = async () => {
  return await prisma.student.findMany();
};

export const getStudentById = async (id) => {
  return await prisma.student.findUnique({ where: { id } });
};

export const getStudentWithCoursesById = async (id) => {
  return await prisma.student.findUnique({
    where: { id },
    include: {
      courses: {
        include: {
          course: true,
        },
      },
    },
  });
};

export const updateStudent = async (id, data) => {
  return await prisma.student.update({ where: { id }, data });
};

export const deleteStudent = async (id) => {
  return await prisma.student.delete({ where: { id } });
};

export const getStudentsWithCourses = async () => {
  return await prisma.student.findMany({
    include: {
      courses: {
        select: {
          course: {
            select: {
              name: true,
            },
          },
          status: true,
          completionDate: true,
        },
      },
    },
  });
};
