import * as enrollmentRepository from "../repositories/enrollment.repository.js";
import { enrollmentSchema } from "../validations/enrollment.validation.js";
import prisma from "../config/database.js";

const calculateStatus = (completionDate) => {
  if (!completionDate) return "IN_PROGRESS";
  const data = new Date(completionDate);
  const hoje = new Date();
  return data <= hoje ? "COMPLETED" : "IN_PROGRESS";
};

export const createEnrollment = async (data) => {
  const { error } = enrollmentSchema.validate(data, { abortEarly: false });
  if (error) {
    throw {
      type: "validation",
      mensagem: "Erro de validação nos dados fornecidos.",
      erros: error.details.map((d) => d.message),
    };
  }

  const student = await prisma.student.findUnique({
    where: { id: data.studentId },
  });
  if (!student) {
    throw {
      type: "not_found",
      mensagem: "O aluno especificado não foi encontrado.",
    };
  }

  const course = await prisma.course.findUnique({
    where: { id: data.courseId },
  });
  if (!course) {
    throw {
      type: "not_found",
      mensagem: "O curso especificado não foi encontrado.",
    };
  }

  const existe = await enrollmentRepository.getEnrollmentByStudentAndCourse(
    data.studentId,
    data.courseId
  );
  if (existe) {
    throw {
      type: "conflict",
      mensagem: "O aluno já está matriculado neste curso.",
    };
  }

  const completionDateObj = data.completionDate
    ? new Date(data.completionDate)
    : null;
  const status = calculateStatus(completionDateObj);

  return await enrollmentRepository.createEnrollment({
    ...data,
    completionDate: completionDateObj,
    status,
  });
};

export const getEnrollments = async () => {
  return await enrollmentRepository.getEnrollments();
};

export const getEnrollmentById = async (id) => {
  const enrollment = await enrollmentRepository.getEnrollmentById(id);
  if (!enrollment) {
    throw {
      type: "not_found",
      mensagem: "Matrícula não encontrada",
    };
  }
  return enrollment;
};

export const updateEnrollment = async (id, data) => {
  await getEnrollmentById(id);

  if (
    data.studentId !== undefined ||
    data.courseId !== undefined ||
    data.completionDate !== undefined
  ) {
    if (data.studentId !== undefined || data.courseId !== undefined) {
      const { error } = enrollmentSchema.validate(data, {
        abortEarly: false,
      });
      if (error) {
        throw {
          type: "validation",
          mensagem: "Erro de validação",
          erros: error.details.map((d) => d.message),
        };
      }
    }
  }

  if (data.studentId || data.courseId) {
    const currentEnrollment = await enrollmentRepository.getEnrollmentById(id);
    const studentIdToCheck = data.studentId || currentEnrollment.studentId;
    const courseIdToCheck = data.courseId || currentEnrollment.courseId;

    const existe = await enrollmentRepository.getEnrollmentByStudentAndCourse(
      studentIdToCheck,
      courseIdToCheck
    );
    if (existe && existe.id !== id) {
      throw {
        type: "conflict",
        mensagem: "Aluno já matriculado nesse curso",
      };
    }
  }

  if (data.completionDate) {
    data.completionDate = new Date(data.completionDate);
    data.status = calculateStatus(data.completionDate);
  }

  return await enrollmentRepository.updateEnrollment(id, data);
};

export const deleteEnrollment = async (id) => {
  await getEnrollmentById(id);
  return await enrollmentRepository.deleteEnrollment(id);
};
