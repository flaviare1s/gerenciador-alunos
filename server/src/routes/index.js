import { Router } from "express";
import alunoRoutes from "./aluno.routes.js";

const router = Router();

router.use("/alunos", alunoRoutes);

export default router;
