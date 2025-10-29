import * as studentRepository from "../repositories/student.repository.js";
import { studentSchema } from "../validations/student.validation.js";
import prisma from "../config/database.js";

export const createStudent = async (data) => {
  const { error } = studentSchema.validate(data, { abortEarly: false });
  if (error) {
    throw {
      type: "validation",
      mensagem: "Erro de validação",
      erros: error.details.map((d) => d.message),
    };
  }

  return await studentRepository.createStudent(data);
};

export const getStudents = async () => {
  const students = await prisma.student.findMany({
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  });

  return students.map((student) => ({
    ...student,
    courses: student.enrollments.map((enrollment) => enrollment.course.name),
  }));
};

export const getStudentById = async (id) => {
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!student) {
    throw {
      type: "not_found",
      mensagem: "Aluno não encontrado",
    };
  }

  return {
    ...student,
    courses: student.enrollments.map((enrollment) => enrollment.course.name),
  };
};

export const updateStudent = async (id, data) => {
  await getStudentById(id);
  const updatedStudent = await prisma.student.update({
    where: { id },
    data,
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  });

  return {
    ...updatedStudent,
    courses: updatedStudent.enrollments.map(
      (enrollment) => enrollment.course.name
    ),
  };
};

export const deleteStudent = async (id) => {
  await getStudentById(id);
  await prisma.enrollment.deleteMany({ where: { studentId: id } });
  return await prisma.student.delete({ where: { id } });
};
