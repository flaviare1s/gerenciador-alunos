import { Router } from "express";
import {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} from "../controllers/enrollment.controller.js";

const router = Router();

/**
 * @swagger
 * /matriculas:
 *   post:
 *     tags:
 *       - Matrículas
 *     summary: Cria uma nova matrícula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 2
 *               courseId:
 *                 type: integer
 *                 example: 8
 *               completionDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Matrícula criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 studentId:
 *                   type: integer
 *                 courseId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   example: "IN_PROGRESS"
 *                 completionDate:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 33
 *               studentId: 2
 *               courseId: 8
 *               status: "IN_PROGRESS"
 *               completionDate: "2025-12-31T00:00:00.000Z"
 */
router.post("/", createEnrollment);

/**
 * @swagger
 * /matriculas:
 *   get:
 *     tags:
 *       - Matrículas
 *     summary: Retorna a lista de todas as matrículas
 *     description: Retorna uma lista de todas as matrículas, incluindo detalhes do aluno e do curso.
 *     responses:
 *       200:
 *         description: Uma lista de matrículas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 58
 *                   studentId:
 *                     type: integer
 *                     example: 82
 *                   courseId:
 *                     type: integer
 *                     example: 1
 *                   status:
 *                     type: string
 *                     example: IN_PROGRESS
 *                   completionDate:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-08-30T00:00:00.000Z
 *                   student:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 82
 *                       firstName:
 *                         type: string
 *                         example: Olivia
 *                       lastName:
 *                         type: string
 *                         example: Rhye
 *                       birthDate:
 *                         type: string
 *                         format: date-time
 *                         example: 1990-01-01T00:00:00.000Z
 *                       cpf:
 *                         type: string
 *                         example: 29814591936
 *                       gender:
 *                         type: string
 *                         example: OTHER
 *                       email:
 *                         type: string
 *                         example: olivia.rhye@example.com
 *                       zipCode:
 *                         type: string
 *                         example: 91530566
 *                       street:
 *                         type: string
 *                         example: Beco H
 *                       number:
 *                         type: string
 *                         example: 123
 *                       complement:
 *                         type: string
 *                         example: null
 *                       neighborhood:
 *                         type: string
 *                         example: Partenon
 *                       city:
 *                         type: string
 *                         example: Porto Alegre
 *                       state:
 *                         type: string
 *                         example: Rio Grande do Sul
 *                       country:
 *                         type: string
 *                         example: Brasil
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-28T10:05:00.173Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-28T10:05:00.173Z
 *                   course:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Design
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-27T16:15:15.827Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-27T16:15:15.827Z
 */
router.get("/", getEnrollments);

/**
 * @swagger
 * /matriculas/{id}:
 *   get:
 *     tags:
 *       - Matrículas
 *     summary: Retorna uma matrícula pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula
 *     responses:
 *       200:
 *         description: Matrícula encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 58
 *                 studentId:
 *                   type: integer
 *                   example: 82
 *                 courseId:
 *                   type: integer
 *                   example: 1
 *                 status:
 *                   type: string
 *                   example: IN_PROGRESS
 *                 completionDate:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-08-30T00:00:00.000Z
 *                 student:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 82
 *                     firstName:
 *                       type: string
 *                       example: Olivia
 *                     lastName:
 *                       type: string
 *                       example: Rhye
 *                     birthDate:
 *                       type: string
 *                       format: date-time
 *                       example: 1990-01-01T00:00:00.000Z
 *                     cpf:
 *                       type: string
 *                       example: 29814591936
 *                     gender:
 *                       type: string
 *                       example: OTHER
 *                     email:
 *                       type: string
 *                       example: olivia.rhye@example.com
 *                     zipCode:
 *                       type: string
 *                       example: 91530566
 *                     street:
 *                       type: string
 *                       example: Beco H
 *                     number:
 *                       type: string
 *                       example: 123
 *                     complement:
 *                       type: string
 *                       example: null
 *                     neighborhood:
 *                       type: string
 *                       example: Partenon
 *                     city:
 *                       type: string
 *                       example: Porto Alegre
 *                     state:
 *                       type: string
 *                       example: Rio Grande do Sul
 *                     country:
 *                       type: string
 *                       example: Brasil
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-28T10:05:00.173Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-28T10:05:00.173Z
 *                 course:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Design
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-27T16:15:15.827Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-27T16:15:15.827Z
 *       404:
 *         description: Matrícula não encontrada
 */
router.get("/:id", getEnrollmentById);

/**
 * @swagger
 * /matriculas/{id}:
 *   put:
 *     tags:
 *       - Matrículas
 *     summary: Atualiza uma matrícula pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 82
 *               courseId:
 *                 type: integer
 *                 example: 8
 *               completionDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-12-31T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Matrícula atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 58
 *                 studentId:
 *                   type: integer
 *                   example: 82
 *                 courseId:
 *                   type: integer
 *                   example: 8
 *                 status:
 *                   type: string
 *                   example: IN_PROGRESS
 *                 completionDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-12-31T00:00:00.000Z"
 *       404:
 *         description: Matrícula não encontrada
 */
router.put("/:id", updateEnrollment);

/**
 * @swagger
 * /matriculas/{id}:
 *   delete:
 *     tags:
 *       - Matrículas
 *     summary: Exclui uma matrícula pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula a ser excluída
 *     responses:
 *       200:
 *         description: Matrícula excluída com sucesso
 *       404:
 *         description: Matrícula não encontrada
 */
router.delete("/:id", deleteEnrollment);

export default router;
