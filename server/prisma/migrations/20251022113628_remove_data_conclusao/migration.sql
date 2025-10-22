/*
  Warnings:

  - You are about to drop the column `dataFim` on the `AlunoCurso` table. All the data in the column will be lost.
  - You are about to drop the column `dataConclusao` on the `Curso` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlunoCurso" DROP COLUMN "dataFim",
ADD COLUMN     "dataConclusao" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "dataConclusao";
