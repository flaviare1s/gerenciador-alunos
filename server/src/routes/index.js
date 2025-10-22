import { Router } from "express";
import alunoRoutes from "./aluno.routes.js";
import cursoRoutes from "./curso.routes.js";
import alunoCursoRoutes from "./alunoCurso.routes.js";

const router = Router();

router.use("/alunos", alunoRoutes);
router.use("/cursos", cursoRoutes);
router.use("/aluno-cursos", alunoCursoRoutes);

export default router;
