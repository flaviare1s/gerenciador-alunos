import Joi from "joi";

export const studentSchema = Joi.object({
  firstName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "O nome é obrigatório",
    "string.min": "O nome deve ter pelo menos 3 caracteres",
    "string.max": "O nome deve ter no máximo 100 caracteres",
  }),
  lastName: Joi.string().min(2).max(100).required().messages({
    "string.empty": "O sobrenome é obrigatório",
    "string.min": "O sobrenome deve ter pelo menos 2 caracteres",
    "string.max": "O sobrenome deve ter no máximo 100 caracteres",
  }),
  birthDate: Joi.date().iso().optional().messages({
    "date.format": "A data de nascimento deve estar em formato ISO",
  }),
  cpf: Joi.string().length(11).required().messages({
    "string.length": "O CPF deve ter 11 dígitos",
    "string.empty": "O CPF é obrigatório",
  }),
  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required().messages({
    "any.only": "O gênero deve ser Masculino, Feminino ou Outro",
    "string.empty": "O gênero é obrigatório",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "O e-mail deve ser válido",
      "string.empty": "O e-mail é obrigatório",
    }),
  zipCode: Joi.string().length(8).required().messages({
    "string.length": "O CEP deve ter 8 caracteres",
    "string.empty": "O CEP é obrigatório",
  }),
  street: Joi.string().min(3).required().messages({
    "string.empty": "A rua é obrigatória",
    "string.min": "A rua deve ter pelo menos 3 caracteres",
  }),
  number: Joi.string().required().messages({
    "string.empty": "O número é obrigatório",
  }),
  complement: Joi.string().allow("").optional(),
  neighborhood: Joi.string().allow("").optional(),
  city: Joi.string().min(2).required().messages({
    "string.empty": "A cidade é obrigatória",
    "string.min": "A cidade deve ter pelo menos 2 caracteres",
  }),
  state: Joi.string().required().messages({
    "string.empty": "O estado é obrigatório",
  }),
  country: Joi.string().min(2).required().messages({
    "string.empty": "O país é obrigatório",
    "string.min": "O país deve ter pelo menos 2 caracteres",
  }),
});
