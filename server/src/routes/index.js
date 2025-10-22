import { Router } from "express";
import alunoRoutes from "./aluno.routes.js";
import cursoRoutes from "./curso.routes.js";

const router = Router();

router.use("/alunos", alunoRoutes);
router.use("/cursos", cursoRoutes);

export default router;
