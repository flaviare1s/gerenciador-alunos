import { z } from "zod";

export const studentSchema = z.object({
  firstName: z
    .string()
    .min(3, "O name deve ter pelo menos 3 caracteres")
    .max(100, "O name deve ter no máximo 100 caracteres"),
  lastName: z
    .string()
    .min(2, "O lastName deve ter pelo menos 2 caracteres")
    .max(100, "O lastName deve ter no máximo 100 caracteres"),
  birthDate: z
    .string()
    .optional()
    .refine(
      (date) => !date || new Date(date) <= new Date(),
      "A data de nascimento não pode ser futura"
    ),
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], "O gênero é obrigatório"),
  email: z.string().email("O e-mail deve ser válido"),
  zipCode: z.string().length(8, "O CEP deve ter 8 caracteres"),
  street: z.string().min(3, "A street é obrigatória"),
  number: z.string().nonempty("O número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(2, "A cidade é obrigatória"),
  state: z.string().length(2, "O estado deve ter 2 letras (UF)"),
  country: z.string().min(2, "O país é obrigatório"),
});
