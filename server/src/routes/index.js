import { Router } from "express";
import studentRoutes from "./student.routes.js";
import courseRoutes from "./course.routes.js";
import enrollmentRoutes from "./enrollment.routes.js";

const router = Router();

router.use("/alunos", studentRoutes);
router.use("/cursos", courseRoutes);
router.use("/matriculas", enrollmentRoutes);

export default router;
