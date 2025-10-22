import * as cursoService from "../services/curso.service.js";

export const criarCurso = async (req, res) => {
  try {
    const curso = await cursoService.criarCurso(req.body);
    res.status(201).json(curso);
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

export const listarCursos = async (_req, res) => {
  try {
    const cursos = await cursoService.listarCursos();
    return res.json(cursos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const buscarCursoPorId = async (req, res) => {
  try {
    const curso = await cursoService.buscarCursoPorId(Number(req.params.id));
    return res.json(curso);
  } catch (err) {
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }
    console.error(err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const atualizarCurso = async (req, res) => {
  try {
    const curso = await cursoService.atualizarCurso(
      Number(req.params.id),
      req.body
    );
    return res.json(curso);
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

export const deletarCurso = async (req, res) => {
  try {
    await cursoService.deletarCurso(Number(req.params.id));
    return res.status(204).send();
  } catch (err) {
    if (err.type === "not_found") {
      return res.status(404).json({ mensagem: err.mensagem });
    }
    console.error(err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
