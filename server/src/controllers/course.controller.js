import * as courseService from "../services/course.service.js";
import { courseSchema } from "../validations/course.validation.js";

export const createCourse = async (req, res) => {
  try {
    const { error } = courseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ mensagem: "Dados inválidos", erros: error.details });
    }

    const course = await courseService.createCourse(req.body);
    res.status(201).json(course);
  } catch (err) {
    if (err.type === "validation") {
      return res.status(400).json({ mensagem: err.mensagem, erros: err.erros });
    }
    if (err.type === "conflict") {
      return res.status(409).json({ mensagem: err.mensagem });
    }

    console.error(err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const getCourses = async (_req, res) => {
  try {
    const courses = await courseService.getCourses();
    return res.json(courses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(Number(req.params.id));
    return res.json(course);
  } catch (err) {
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }
    console.error(err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await courseService.updateCourse(
      Number(req.params.id),
      req.body
    );
    return res.json(course);
  } catch (err) {
    if (err.type === "validation") {
      return res.status(400).json({ mensagem: err.mensagem, erros: err.erros });
    }
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }
    console.error(err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await courseService.deleteCourse(Number(req.params.id));
    return res.status(204).send();
  } catch (err) {
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }
    console.error(err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
