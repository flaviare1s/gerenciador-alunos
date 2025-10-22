import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cursos = [
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
  "DEVOPS",
];

async function main() {
  for (const nome of cursos) {
    const existe = await prisma.curso.findUnique({ where: { nome } });
    if (!existe) {
      await prisma.curso.create({ data: { nome } });
      console.log(`Curso criado: ${nome}`);
    } else {
      console.log(`Curso já existe: ${nome}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
