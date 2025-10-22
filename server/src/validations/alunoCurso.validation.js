import Joi from "joi";

export const alunoCursoSchema = Joi.object({
  alunoId: Joi.number().integer().required().messages({
    "number.base": "O ID do aluno deve ser um número",
    "number.integer": "O ID do aluno deve ser um número inteiro",
    "any.required": "O ID do aluno é obrigatório",
  }),
  cursoId: Joi.number().integer().required().messages({
    "number.base": "O ID do curso deve ser um número",
    "number.integer": "O ID do curso deve ser um número inteiro",
    "any.required": "O ID do curso é obrigatório",
  }),
  dataConclusao: Joi.date().required().messages({
    "date.base": "A data de conclusão deve ser uma data válida",
    "any.required": "A data de conclusão é obrigatória",
  }),
});
