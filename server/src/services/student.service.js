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

export const createStudentWithCourses = async (data) => {
  const { courses, ...studentData } = data;

  const { error } = studentSchema.validate(studentData, { abortEarly: false });
  if (error) {
    throw {
      type: "validation",
      mensagem: "Erro de validação",
      erros: error.details.map((d) => d.message),
    };
  }

  const createdStudent = await prisma.student.create({
    data: studentData,
  });

  if (courses && courses.length > 0) {
    const enrollments = courses.map((courseId) => ({
      studentId: createdStudent.id,
      courseId,
    }));

    await prisma.enrollment.createMany({ data: enrollments });
  }

  return createdStudent;
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

export const getStudentsWithCourses = async () => {
  const students = await studentRepository.getStudentsWithCourses();

  return students.map((student) => ({
    ...student,
    courses: student.enrollments.map((enrollment) => ({
      name: enrollment.course.name,
      status: enrollment.status,
      completionDate: enrollment.completionDate,
    })),
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

export const getStudentWithCoursesById = async (id) => {
  const student = await studentRepository.getStudentWithCoursesById(id);

  if (!student) {
    throw {
      type: "not_found",
      mensagem: "Aluno não encontrado",
    };
  }

  return {
    ...student,
    courses:
      student.enrollments?.map((enrollment) => ({
        name: enrollment.course.name,
        status: enrollment.status,
        completionDate: enrollment.completionDate,
      })) || [],
  };
};

export const updateStudent = async (id, data) => {
  await getStudentById(id);
  const studentAtualizado = await prisma.student.update({
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
    ...studentAtualizado,
    courses: studentAtualizado.enrollments.map(
      (enrollment) => enrollment.course.name
    ),
  };
};

export const updateStudentWithCourses = async (id, data) => {
  const { courses, ...studentData } = data;

  await getStudentById(id);

  const updatedStudent = await prisma.student.update({
    where: { id },
    data: studentData,
  });

  if (courses) {
    const existingEnrollments = await prisma.enrollment.findMany({
      where: { studentId: id },
    });

    const existingCourseIds = existingEnrollments.map((e) => e.courseId);

    const coursesToAdd = courses.filter(
      (courseId) => !existingCourseIds.includes(courseId)
    );
    const coursesToRemove = existingCourseIds.filter(
      (courseId) => !courses.includes(courseId)
    );

    if (coursesToAdd.length > 0) {
      const newEnrollments = coursesToAdd.map((courseId) => ({
        studentId: id,
        courseId,
      }));

      await prisma.enrollment.createMany({ data: newEnrollments });
    }

    if (coursesToRemove.length > 0) {
      await prisma.enrollment.deleteMany({
        where: {
          studentId: id,
          courseId: { in: coursesToRemove },
        },
      });
    }
  }

  return updatedStudent;
};

export const deleteStudent = async (id) => {
  await getStudentById(id);
  await prisma.enrollment.deleteMany({ where: { studentId: id } });
  return await prisma.student.delete({ where: { id } });
};
