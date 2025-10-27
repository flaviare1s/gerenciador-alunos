import prisma from "../config/database.js";

export const createEnrollment = async (data) => {
  return await prisma.enrollment.create({ data });
};

export const getEnrollments = async () => {
  return await prisma.enrollment.findMany({
    include: {
      student: true,
      course: true,
    },
  });
};

export const getEnrollmentById = async (id) => {
  return await prisma.enrollment.findUnique({
    where: { id },
    include: {
      student: true,
      course: true,
    },
  });
};

export const updateEnrollment = async (id, data) => {
  return await prisma.enrollment.update({
    where: { id },
    data,
  });
};

export const deleteEnrollment = async (id) => {
  return await prisma.enrollment.delete({
    where: { id },
  });
};

export const getEnrollmentByStudentAndCourse = async (
  studentId,
  courseId
) => {
  return await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
  });
};
