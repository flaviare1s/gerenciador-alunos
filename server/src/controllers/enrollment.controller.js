import * as enrollmentService from "../services/enrollment.service.js";

export const createEnrollment = async (req, res) => {
  try {
    const enrollment = await enrollmentService.createEnrollment(req.body);
    return res.status(201).json(enrollment);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({
        mensagem: "Aluno já matriculado neste curso",
      });
    }

    if (err.type === "validation") {
      return res.status(400).json({
        mensagem: err.mensagem,
        erros: err.erros,
      });
    }

    if (err.type === "not_found") {
      return res.status(404).json({
        mensagem: err.mensagem,
      });
    }

    if (err.type === "conflict") {
      return res.status(409).json({
        mensagem: err.mensagem,
      });
    }

    console.error("Erro ao criar matrícula:", err);
    return res.status(500).json({
      mensagem: "Erro interno ao criar matrícula",
    });
  }
};

export const getEnrollments = async (_req, res) => {
  try {
    const enrollments = await enrollmentService.getEnrollments();
    return res.status(200).json(enrollments);
  } catch (err) {
    console.error("Erro ao listar matrículas:", err);
    return res.status(500).json({
      mensagem: "Erro interno ao listar matrículas",
    });
  }
};

export const getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await enrollmentService.getEnrollmentById(Number(id));
    return res.status(200).json(enrollment);
  } catch (err) {
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }

    console.error("Erro ao buscar matrícula:", err);
    return res.status(500).json({
      mensagem: "Erro interno ao buscar matrícula",
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
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }

    if (err.type === "validation") {
      return res.status(400).json({
        mensagem: err.mensagem,
        erros: err.erros,
      });
    }

    if (err.type === "conflict") {
      return res.status(409).json({
        mensagem: err.mensagem,
      });
    }

    console.error("Erro ao atualizar matrícula:", err);
    return res.status(500).json({
      mensagem: "Erro interno ao atualizar matrícula",
    });
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    await enrollmentService.deleteEnrollment(Number(id));
    return res.status(204).send();
  } catch (err) {
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }

    console.error("Erro ao deletar matrícula:", err);
    return res.status(500).json({
      mensagem: "Erro interno ao deletar matrícula",
    });
  }
};
