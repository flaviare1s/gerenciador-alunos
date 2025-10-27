import * as enrollmentRepository from "../repositories/enrollment.repository.js";
import { enrollmentSchema } from "../validations/enrollment.validation.js";
import * as studentRepository from "../repositories/student.repository.js";
import * as courseRepository from "../repositories/course.repository.js";

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

  try {
    const student = await studentRepository.getStudentById(data.studentId);
    if (!student) {
      throw {
        type: "not_found",
        mensagem: "O aluno especificado não foi encontrado.",
      };
    }

    const course = await courseRepository.getCourseById(data.courseId);
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

    const completionDateObj = new Date(data.completionDate);
    const status = calculateStatus(completionDateObj);

    return await enrollmentRepository.createEnrollment({
      ...data,
      completionDate: completionDateObj,
      status,
    });
  } catch (err) {
    if (!err.type) {
      throw {
        type: "server_error",
        mensagem: "Erro interno ao processar a solicitação.",
      };
    }
    throw err;
  }
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

  const { error } = enrollmentSchema.validate(data, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (error) {
    throw {
      type: "validation",
      mensagem: "Erro de validação",
      erros: error.details.map((d) => d.message),
    };
  }

  if (data.studentId || data.courseId) {
    const existe = await enrollmentRepository.getEnrollmentByStudentAndCourse(
      data.studentId ?? undefined,
      data.courseId ?? undefined
    );
    if (existe && existe.id !== id) {
      throw {
        type: "conflict",
        mensagem: "Aluno já matriculado nesse curso",
      };
    }
  }

  if (data.completionDate) {
    data.status = calculateStatus(data.completionDate);
  }

  return await enrollmentRepository.updateEnrollment(id, data);
};

export const deleteEnrollment = async (id) => {
  await getEnrollmentById(id);
  return await enrollmentRepository.deleteEnrollment(id);
};
