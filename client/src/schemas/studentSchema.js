import { z } from "zod";

const isValidCPF = (cpf) => {
  const cleanedCPF = cpf.replace(/\D/g, "");
  let sum = 0;
  let remainder;
  if (cleanedCPF === "00000000000") return false;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanedCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanedCPF.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanedCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cleanedCPF.substring(10, 11));
};

export const studentSchema = z.object({
  firstName: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  lastName: z
    .string()
    .min(2, "O sobrenome deve ter pelo menos 2 caracteres")
    .max(100, "O sobrenome deve ter no máximo 100 caracteres"),
  birthDate: z
    .string()
    .nonempty("A data de nascimento é obrigatória")
    .refine((date) => {
      const d = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - d.getFullYear();
      const monthDiff = today.getMonth() - d.getMonth();
      const dayDiff = today.getDate() - d.getDate();
      const isValidAge =
        age > 14 ||
        (age === 14 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
      const isUnder100 = age < 100;
      return !isNaN(d.getTime()) && d <= today && isValidAge && isUnder100;
    }, "A idade deve estar entre 14 e 100 anos"),
  cpf: z.string().refine(isValidCPF, "O CPF informado é inválido"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], "O gênero é obrigatório"),
  email: z.string().email("O e-mail deve ser válido"),
  zipCode: z.string().nonempty("O CEP é obrigatório"),
  street: z.string().min(3, "A rua é obrigatória"),
  number: z.string().nonempty("O número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(2, "A cidade é obrigatória"),
  state: z.string().nonempty("O estado é obrigatório"),
  country: z.string().min(2, "O país é obrigatório"),
});
