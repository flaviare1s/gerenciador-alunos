-- CreateEnum
CREATE TYPE "StatusCurso" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO');

-- CreateEnum
CREATE TYPE "TipoCurso" AS ENUM ('DESIGN', 'MARKETING', 'PRODUCT', 'INTRODUCAO_AO_FIGMA', 'FULL_STACK', 'FRONT_END', 'BACK_END', 'UI_UX', 'BANCO_DE_DADOS', 'CIENCIA_DE_DADOS', 'DEVOPS');

-- CreateTable
CREATE TABLE "Aluno" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "cpf" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "pais" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "nome" "TipoCurso" NOT NULL,
    "descricao" TEXT,
    "dataConclusao" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlunoCurso" (
    "id" SERIAL NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "status" "StatusCurso" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" TIMESTAMP(3),

    CONSTRAINT "AlunoCurso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_cpf_key" ON "Aluno"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_email_key" ON "Aluno"("email");

-- AddForeignKey
ALTER TABLE "AlunoCurso" ADD CONSTRAINT "AlunoCurso_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlunoCurso" ADD CONSTRAINT "AlunoCurso_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
