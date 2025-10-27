import { z } from "zod";

export const alunoSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  sobrenome: z
    .string()
    .min(2, "O sobrenome deve ter pelo menos 2 caracteres")
    .max(100, "O sobrenome deve ter no máximo 100 caracteres"),
  dataNascimento: z
    .string()
    .optional()
    .refine(
      (date) => !date || new Date(date) <= new Date(),
      "A data de nascimento não pode ser futura"
    ),
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos"),
  genero: z.enum(["Feminino", "Masculino", "Outro"], {
    errorMap: () => ({
      message: "O gênero deve ser Feminino, Masculino ou Outro",
    }),
  }),
  email: z.string().email("O e-mail deve ser válido"),
  cep: z.string().length(8, "O CEP deve ter 8 caracteres"),
  rua: z.string().min(3, "A rua é obrigatória"),
  numero: z.string().min(1, "O número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().min(2, "A cidade é obrigatória"),
  estado: z.string().length(2, "O estado deve ter 2 letras (UF)"),
  pais: z.string().min(2, "O país é obrigatório"),
});
