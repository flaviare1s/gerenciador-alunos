import { Router } from "express";
import * as alunoCursoController from "../controllers/alunoCurso.controller.js";

const router = Router();

router.post("/", alunoCursoController.criarAlunoCurso);
router.get("/", alunoCursoController.listarAlunoCursos);
router.get("/:id", alunoCursoController.buscarAlunoCursoPorId);
router.put("/:id", alunoCursoController.atualizarAlunoCurso);
router.delete("/:id", alunoCursoController.deletarAlunoCurso);

export default router;
