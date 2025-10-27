import * as enrollmentService from "../services/enrollment.service.js";

export const createEnrollment = async (req, res) => {
  try {
    const enrollment = await enrollmentService.createEnrollment(req.body);
    return res.status(201).json(enrollment);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      mensagem: err.mensagem || "Erro interno do servidor",
      erros: err.erros || [],
    });
  }
};

export const getEnrollments = async (_req, res) => {
  try {
    const enrollments = await enrollmentService.getEnrollments();
    return res.status(200).json(enrollments);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      mensagem: err.mensagem || "Erro interno do servidor",
      erros: err.erros || [],
    });
  }
};

export const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await enrollmentService.getEnrollmentById(
      Number(id)
    );
    return res.status(200).json(enrollment);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      mensagem: err.mensagem || "Erro interno do servidor",
      erros: err.erros || [],
    });
  }
};

export const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await enrollmentService.updateEnrollment(
      Number(id),
      req.body
    );
    return res.status(200).json(enrollment);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      mensagem: err.mensagem || "Erro interno do servidor",
      erros: err.erros || [],
    });
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    await enrollmentService.deleteEnrollment(Number(id));
    return res.status(204).send();
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      mensagem: err.mensagem || "Erro interno do servidor",
      erros: err.erros || [],
    });
  }
};
