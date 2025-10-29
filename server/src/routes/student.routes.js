import { Router } from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Alunos
 *   description: Endpoints para gerenciar alunos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Aluno:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date-time
 *         cpf:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *         email:
 *           type: string
 *         zipCode:
 *           type: string
 *         street:
 *           type: string
 *         number:
 *           type: string
 *         complement:
 *           type: string
 *         neighborhood:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         country:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         enrollments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               studentId:
 *                 type: integer
 *               courseId:
 *                 type: integer
 *               status:
 *                 type: string
 *               completionDate:
 *                 type: string
 *                 format: date-time
 *               course:
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
 *         courses:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Cria um novo aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *           example:
 *             firstName: Matheus
 *             lastName: Souza
 *             birthDate: 2002-10-10T00:00:00.000Z
 *             cpf: 12345678903
 *             gender: MALE
 *             email: matheue@example.com
 *             zipCode: 60115060
 *             street: Rua das Palmeiras
 *             number: 123
 *             complement: Apto 402
 *             neighborhood: Aldeota
 *             city: Fortaleza
 *             state: CE
 *             country: Brasil
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 erros:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Erro interno ao criar aluno
 */

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Retorna a lista de alunos
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: Lista de alunos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aluno'
 *       500:
 *         description: Erro interno ao listar students
 */

/**
 * @swagger
 * /alunos/{id}:
 *   get:
 *     summary: Retorna os detalhes de um aluno pelo ID
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Detalhes do aluno retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Aluno não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *       500:
 *         description: Erro interno ao buscar aluno
 */

/**
 * @swagger
 * /alunos/{id}:
 *   put:
 *     summary: Atualiza os dados de um aluno pelo ID
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *           example:
 *             firstName: Matheus
 *             lastName: Souza
 *             birthDate: 2002-10-10T00:00:00.000Z
 *             cpf: 12345678903
 *             gender: MALE
 *             email: matheue@example.com
 *             zipCode: 60115060
 *             street: Rua das Palmeiras
 *             number: 123
 *             complement: Apto 402
 *             neighborhood: Aldeota
 *             city: Fortaleza
 *             state: CE
 *             country: Brasil
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 student:
 *                   $ref: '#/components/schemas/Aluno'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 erros:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Erro interno ao atualizar student
 */

/**
 * @swagger
 * /alunos/{id}:
 *   delete:
 *     summary: Remove um aluno pelo ID
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                 student:
 *                   $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Aluno não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *       500:
 *         description: Erro interno ao deletar student
 */
router.post("/", createStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
