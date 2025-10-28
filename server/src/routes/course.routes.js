import { Router } from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

const router = Router();

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retorna a lista de cursos
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *             example:
 *               - id: 1
 *                 name: "Design"
 *                 createdAt: "2025-10-27T16:15:15.827Z"
 *                 updatedAt: "2025-10-27T16:15:15.827Z"
 *               - id: 2
 *                 name: "Marketing"
 *                 createdAt: "2025-10-27T16:15:15.833Z"
 *                 updatedAt: "2025-10-27T16:15:15.833Z"
 *               - id: 3
 *                 name: "Product"
 *                 createdAt: "2025-10-27T16:15:15.835Z"
 *                 updatedAt: "2025-10-27T16:15:15.835Z"
 *               - id: 4
 *                 name: "Introdução ao Figma"
 *                 createdAt: "2025-10-27T16:15:15.838Z"
 *                 updatedAt: "2025-10-27T16:15:15.838Z"
 *               - id: 5
 *                 name: "Full Stack"
 *                 createdAt: "2025-10-27T16:15:15.840Z"
 *                 updatedAt: "2025-10-27T16:15:15.840Z"
 *               - id: 6
 *                 name: "FrontEnd"
 *                 createdAt: "2025-10-27T16:15:15.842Z"
 *                 updatedAt: "2025-10-28T10:19:14.823Z"
 *               - id: 7
 *                 name: "Back End"
 *                 createdAt: "2025-10-27T16:15:15.844Z"
 *                 updatedAt: "2025-10-27T16:15:15.844Z"
 *               - id: 8
 *                 name: "UI/UX"
 *                 createdAt: "2025-10-27T16:15:15.845Z"
 *                 updatedAt: "2025-10-27T16:15:15.845Z"
 *               - id: 9
 *                 name: "Banco de Dados"
 *                 createdAt: "2025-10-27T16:15:15.847Z"
 *                 updatedAt: "2025-10-27T16:15:15.847Z"
 *               - id: 10
 *                 name: "Ciência de Dados"
 *                 createdAt: "2025-10-27T16:15:15.849Z"
 *                 updatedAt: "2025-10-27T16:15:15.849Z"
 *               - id: 11
 *                 name: "DevOps"
 *                 createdAt: "2025-10-27T16:15:15.851Z"
 *                 updatedAt: "2025-10-27T16:15:15.851Z"
 *               - id: 13
 *                 name: "IA - Inteligência Artificial"
 *                 createdAt: "2025-10-27T20:24:51.241Z"
 *                 updatedAt: "2025-10-27T20:25:13.208Z"
 */
router.get("/", getCourses);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Cria um novo curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Docker"
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 16
 *               name: "Docker"
 *               createdAt: "2025-10-28T10:41:30.875Z"
 *               updatedAt: "2025-10-28T10:41:30.875Z"
 */
router.post("/", createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Retorna um curso pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 2
 *               name: "Marketing"
 *               createdAt: "2025-10-27T16:15:15.833Z"
 *               updatedAt: "2025-10-27T16:15:15.833Z"
 *       404:
 *         description: Curso não encontrado
 */
router.get("/:id", getCourseById);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Atualiza um curso pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "FrontEnd"
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 6
 *               name: "FrontEnd"
 *               createdAt: "2025-10-27T16:15:15.842Z"
 *               updatedAt: "2025-10-28T10:44:15.010Z"
 *       404:
 *         description: Curso não encontrado
 */
router.put("/:id", updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Atualiza um curso pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "FrontEnd"
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 6
 *               name: "FrontEnd"
 *               createdAt: "2025-10-27T16:15:15.842Z"
 *               updatedAt: "2025-10-28T10:44:15.010Z"
 *       404:
 *         description: Curso não encontrado
 */
router.delete("/:id", deleteCourse);

export default router;
