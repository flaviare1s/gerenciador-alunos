import { Router } from "express";
import {
  criarAluno,
  listarAlunos,
  buscarAlunoPorId,
  atualizarAluno,
  deletarAluno,
} from "../controllers/aluno.controller.js";

const router = Router();

router.post("/", criarAluno);
router.get("/", listarAlunos);
router.get("/:id", buscarAlunoPorId);
router.put("/:id", atualizarAluno);
router.delete("/:id", deletarAluno);

export default router;
