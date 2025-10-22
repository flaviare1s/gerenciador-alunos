import Joi from "joi";

export const alunoSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required().messages({
    "string.empty": "O nome é obrigatório",
    "string.min": "O nome deve ter pelo menos 3 caracteres",
    "string.max": "O nome deve ter no máximo 100 caracteres",
  }),
  sobrenome: Joi.string().min(2).max(100).required().messages({
    "any.required": "O sobrenome é obrigatório",
  }),
  dataNascimento: Joi.date().iso().optional().messages({
    "date.format": "A data de nascimento deve estar em formato ISO",
  }),
  cpf: Joi.string().length(11).required().messages({
    "string.length": "O CPF deve ter 11 dígitos",
    "any.required": "O CPF é obrigatório",
  }),
  genero: Joi.string()
    .valid("Feminino", "Masculino", "Outro")
    .required()
    .messages({
      "any.only": "O gênero deve ser Feminino, Masculino ou Outro",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "O e-mail deve ser válido",
      "any.required": "O e-mail é obrigatório",
    }),
  cep: Joi.string().length(8).required().messages({
    "string.length": "O CEP deve ter 8 caracteres",
    "any.required": "O CEP é obrigatório",
  }),
  rua: Joi.string().min(3).required().messages({
    "any.required": "A rua é obrigatória",
  }),
  numero: Joi.string().required().messages({
    "any.required": "O número é obrigatório",
  }),
  complemento: Joi.string().allow("").optional(),
  bairro: Joi.string().allow("").optional(),
  cidade: Joi.string().min(2).required().messages({
    "any.required": "A cidade é obrigatória",
  }),
  estado: Joi.string().min(2).max(2).required().messages({
    "string.length": "O estado deve ter 2 letras (UF)",
    "any.required": "O estado é obrigatório",
  }),
  pais: Joi.string().min(2).required().messages({
    "any.required": "O país é obrigatório",
  }),
});
