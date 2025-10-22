import * as alunoCursoRepository from "../repositories/alunoCurso.repository.js";
import { alunoCursoSchema } from "../validations/alunoCurso.validation.js";
import * as alunoRepository from "../repositories/aluno.repository.js";
import * as cursoRepository from "../repositories/curso.repository.js";

const calcularStatus = (dataConclusao) => {
  if (!dataConclusao) return "EM_ANDAMENTO";
  const data = new Date(dataConclusao);
  const hoje = new Date();
  return data <= hoje ? "CONCLUIDO" : "EM_ANDAMENTO";
};

export const criarAlunoCurso = async (data) => {
  const { error } = alunoCursoSchema.validate(data, { abortEarly: false });
  if (error) {
    throw {
      type: "validation",
      mensagem: "Erro de validação nos dados fornecidos.",
      erros: error.details.map((d) => d.message),
    };
  }

  try {
    const aluno = await alunoRepository.buscarAlunoPorId(data.alunoId);
    if (!aluno) {
      throw {
        type: "not_found",
        mensagem: "O aluno especificado não foi encontrado.",
      };
    }

    const curso = await cursoRepository.buscarCursoPorId(data.cursoId);
    if (!curso) {
      throw {
        type: "not_found",
        mensagem: "O curso especificado não foi encontrado.",
      };
    }

    const existe = await alunoCursoRepository.buscarAlunoCursoPorAlunoECurso(
      data.alunoId,
      data.cursoId
    );
    if (existe) {
      throw {
        type: "conflict",
        mensagem: "O aluno já está matriculado neste curso.",
      };
    }

    const dataConclusaoObj = new Date(data.dataConclusao);
    const status = calcularStatus(dataConclusaoObj);

    return await alunoCursoRepository.criarAlunoCurso({
      ...data,
      dataConclusao: dataConclusaoObj,
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

export const listarAlunoCursos = async () => {
  return await alunoCursoRepository.listarAlunoCursos();
};

export const buscarAlunoCursoPorId = async (id) => {
  const alunoCurso = await alunoCursoRepository.buscarAlunoCursoPorId(id);
  if (!alunoCurso) {
    throw {
      type: "not_found",
      mensagem: "Matrícula não encontrada",
    };
  }
  return alunoCurso;
};

export const atualizarAlunoCurso = async (id, data) => {
  await buscarAlunoCursoPorId(id);

  const { error } = alunoCursoSchema.validate(data, {
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

  if (data.alunoId || data.cursoId) {
    const existe = await alunoCursoRepository.buscarAlunoCursoPorAlunoECurso(
      data.alunoId ?? undefined,
      data.cursoId ?? undefined
    );
    if (existe && existe.id !== id) {
      throw {
        type: "conflict",
        mensagem: "Aluno já matriculado nesse curso",
      };
    }
  }

  if (data.dataConclusao) {
    data.status = calcularStatus(data.dataConclusao);
  }

  return await alunoCursoRepository.atualizarAlunoCurso(id, data);
};

export const deletarAlunoCurso = async (id) => {
  await buscarAlunoCursoPorId(id);
  return await alunoCursoRepository.deletarAlunoCurso(id);
};
