import { Router } from "express";
import {
  criarCurso,
  listarCursos,
  buscarCursoPorId,
  atualizarCurso,
  deletarCurso,
} from "../controllers/curso.controller.js";

const router = Router();

router.post("/", criarCurso);
router.get("/", listarCursos);
router.get("/:id", buscarCursoPorId);
router.put("/:id", atualizarCurso);
router.delete("/:id", deletarCurso);

export default router;
