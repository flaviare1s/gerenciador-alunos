import * as alunoService from "../services/aluno.service.js";
import { alunoSchema } from "../validations/aluno.validation.js";

export const criarAluno = async (req, res) => {
  try {
    const aluno = await alunoService.criarAluno(req.body);
    res.status(201).json(aluno);
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

    res.status(500).json({ mensagem: "Erro interno ao criar aluno" });
  }
};

export const listarAlunos = async (req, res) => {
  try {
    const alunos = await alunoService.listarAlunos();
    return res.status(200).json(alunos);
  } catch (err) {
    console.error("Erro ao listar alunos:", err);
    return res.status(500).json({ mensagem: "Erro interno ao listar alunos" });
  }
};

export const buscarAlunoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const aluno = await alunoService.buscarAlunoPorId(Number(id));

    if (!aluno) {
      return res.status(404).json({ mensagem: "Aluno não encontrado" });
    }

    return res.status(200).json(aluno);
  } catch (err) {
    console.error("Erro ao buscar aluno:", err);
    return res.status(500).json({ mensagem: "Erro interno ao buscar aluno" });
  }
};

export const atualizarAluno = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = alunoSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const mensagens = error.details.map((d) => d.message);
      return res
        .status(400)
        .json({ mensagem: "Erro de validação", erros: mensagens });
    }

    const alunoAtualizado = await alunoService.atualizarAluno(
      Number(id),
      req.body
    );
    return res
      .status(200)
      .json({
        mensagem: "Aluno atualizado com sucesso",
        aluno: alunoAtualizado,
      });
  } catch (err) {
    console.error("Erro ao atualizar aluno:", err);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao atualizar aluno" });
  }
};

export const deletarAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const aluno = await alunoService.deletarAluno(Number(id));

    return res
      .status(200)
      .json({ mensagem: "Aluno deletado com sucesso", aluno });
  } catch (err) {
    console.error("Erro ao deletar aluno:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ mensagem: "Aluno não encontrado" });
    }
    return res.status(500).json({ mensagem: "Erro interno ao deletar aluno" });
  }
};
