import * as studentService from "../services/student.service.js";
import { studentSchema } from "../validations/student.validation.js";

export const createStudent = async (req, res) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        mensagem: "Erro de validação",
        erros: [`${error.meta.target[0]} já cadastrado`],
      });
    }

    if (error.erros) {
      return res.status(400).json(error);
    }

    res.status(500).json({ mensagem: "Erro interno ao criar student" });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await studentService.getStudents();
    return res.status(200).json(students);
  } catch (err) {
    console.error("Erro ao listar students:", err);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao listar students" });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(Number(id));

    return res.status(200).json(student);
  } catch (err) {
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }

    console.error("Erro ao buscar student:", err);
    return res.status(500).json({ mensagem: "Erro interno ao buscar student" });
  }
};

export const getStudentWithCoursesById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentWithCoursesById(
      Number(id)
    );

    return res.status(200).json(student);
  } catch (err) {
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }

    console.error("Erro ao buscar student com courses:", err);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao buscar student com courses" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = studentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const mensagens = error.details.map((d) => d.message);
      return res
        .status(400)
        .json({ mensagem: "Erro de validação", erros: mensagens });
    }

    const studentUpdated = await studentService.updateStudent(
      Number(id),
      req.body
    );
    return res.status(200).json({
      mensagem: "student atualizado com sucesso",
      student: studentAtualizado,
    });
  } catch (err) {
    console.error("Erro ao atualizar student:", err);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao atualizar student" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentService.deleteStudent(Number(id));

    return res
      .status(200)
      .json({ mensagem: "student deletado com sucesso", student });
  } catch (err) {
    console.error("Erro ao deletar student:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ mensagem: "student não encontrado" });
    }
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao deletar student" });
  }
};

export const getStudentsWithCourses = async (_req, res) => {
  try {
    const students = await studentService.getStudentsWithCourses();
    return res.status(200).json(students);
  } catch (err) {
    console.error("Erro ao listar students com courses:", err);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao listar students com courses" });
  }
};
