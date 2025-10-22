import * as alunoCursoService from "../services/alunoCurso.service.js";

export const criarAlunoCurso = async (req, res) => {
  try {
    const alunoCurso = await alunoCursoService.criarAlunoCurso(req.body);
    return res.status(201).json(alunoCurso);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      mensagem: err.mensagem || "Erro interno do servidor",
      erros: err.erros || [],
    });
  }
};

export const listarAlunoCursos = async (_req, res) => {
  try {
    const alunoCursos = await alunoCursoService.listarAlunoCursos();
    return res.status(200).json(alunoCursos);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      mensagem: err.mensagem || "Erro interno do servidor",
      erros: err.erros || [],
    });
  }
};

export const buscarAlunoCursoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const alunoCurso = await alunoCursoService.buscarAlunoCursoPorId(
      Number(id)
    );
    return res.status(200).json(alunoCurso);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      mensagem: err.mensagem || "Erro interno do servidor",
      erros: err.erros || [],
    });
  }
};

export const atualizarAlunoCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const alunoCurso = await alunoCursoService.atualizarAlunoCurso(
      Number(id),
      req.body
    );
    return res.status(200).json(alunoCurso);
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      mensagem: err.mensagem || "Erro interno do servidor",
      erros: err.erros || [],
    });
  }
};

export const deletarAlunoCurso = async (req, res) => {
  try {
    const { id } = req.params;
    await alunoCursoService.deletarAlunoCurso(Number(id));
    return res.status(204).send();
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      mensagem: err.mensagem || "Erro interno do servidor",
      erros: err.erros || [],
    });
  }
};
