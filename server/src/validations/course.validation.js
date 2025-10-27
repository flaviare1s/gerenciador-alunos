import Joi from "joi";

export const courseSchema = Joi.object({
  name: Joi.string()
    .valid(
      "DESIGN",
      "MARKETING",
      "PRODUCT",
      "INTRODUCAO_AO_FIGMA",
      "FULL_STACK",
      "FRONT_END",
      "BACK_END",
      "UI_UX",
      "BANCO_DE_DADOS",
      "CIENCIA_DE_DADOS",
      "DEVOPS"
    )
    .required()
    .messages({
      "any.required": "Selecione o name do curso",
      "any.only": "O valor selecionado para o curso é inválido",
    }),
});
