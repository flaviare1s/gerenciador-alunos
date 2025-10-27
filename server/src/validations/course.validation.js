import Joi from "joi";

export const courseSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Selecione o nome do curso",
    "string.base": "O nome do curso deve ser uma string",
    "string.empty": "O nome do curso não pode ser vazio",
  }),
});
