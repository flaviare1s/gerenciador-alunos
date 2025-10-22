/*
  Warnings:

  - A unique constraint covering the columns `[alunoId,cursoId]` on the table `AlunoCurso` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AlunoCurso_alunoId_cursoId_key" ON "AlunoCurso"("alunoId", "cursoId");
