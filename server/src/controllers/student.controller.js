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

    if (error.type === "validation") {
      return res.status(400).json({
        mensagem: error.mensagem,
        erros: error.erros,
      });
    }

    console.error("Erro ao criar aluno:", error);
    res.status(500).json({ mensagem: "Erro interno ao criar aluno" });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await studentService.getStudents();
    return res.status(200).json(students);
  } catch (err) {
    console.error("Erro ao listar alunos:", err);
    return res.status(500).json({ mensagem: "Erro interno ao listar alunos" });
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

    console.error("Erro ao buscar aluno:", err);
    return res.status(500).json({ mensagem: "Erro interno ao buscar aluno" });
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
      mensagem: "Aluno atualizado com sucesso",
      student: studentUpdated,
    });
  } catch (err) {
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }

    console.error("Erro ao atualizar aluno:", err);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao atualizar aluno" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await studentService.deleteStudent(Number(id));
    return res.status(204).send();
  } catch (err) {
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }

    console.error("Erro ao deletar aluno:", err);
    return res.status(500).json({ mensagem: "Erro interno ao deletar aluno" });
  }
};
