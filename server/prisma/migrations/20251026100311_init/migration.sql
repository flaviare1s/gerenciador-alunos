/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Curso` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Curso_nome_key" ON "Curso"("nome");
