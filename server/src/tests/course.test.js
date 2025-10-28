import request from "supertest";
import { app } from "../../app.js";
import prisma from "../../src/config/database.js";

describe("Courses API", () => {
  let courseId;

  beforeAll(async () => {
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();

    const course = await prisma.course.create({
      data: {
        name: "Curso de Teste Inicial",
      },
    });
    courseId = course.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/cursos", () => {
    it("deve criar um novo curso e retornar status 201", async () => {
      const novoCurso = {
        name: `Curso de Teste ${Date.now()}`,
      };

      const response = await request(app).post("/api/cursos").send(novoCurso);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(novoCurso.name);
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });
  });

  describe("GET /api/cursos", () => {
    it("deve listar todos os cursos", async () => {
      const response = await request(app).get("/api/cursos");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/cursos/:id", () => {
    it("deve retornar o curso pelo ID", async () => {
      const response = await request(app).get(`/api/cursos/${courseId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", courseId);
    });
  });

  describe("PUT /api/cursos/:id", () => {
    it("deve atualizar o curso e retornar status 200", async () => {
      const UpdatedCourse = {
        name: `Curso Atualizado ${Date.now()}`,
      };

      const response = await request(app)
        .put(`/api/cursos/${courseId}`)
        .send(UpdatedCourse);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(UpdatedCourse.name);
    });
  });

  describe("DELETE /api/cursos/:id", () => {
    it("deve deletar o curso e retornar status 204", async () => {
      const courseToDelete = await prisma.course.create({
        data: { name: `Curso Deletar ${Date.now()}` },
      });

      const response = await request(app).delete(
        `/api/cursos/${courseToDelete.id}`
      );

      expect(response.status).toBe(204);
    });
  });

  describe("Cenários de Erro", () => {
    it("deve retornar 400 ao criar curso com dados inválidos", async () => {
      const response = await request(app).post("/api/cursos").send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("mensagem");
    });

    it("deve retornar 409 ao criar curso com nome duplicado", async () => {
      const courseName = `Curso Dup ${Date.now()}`;

      await request(app).post("/api/cursos").send({ name: courseName });
      const response = await request(app)
        .post("/api/cursos")
        .send({ name: courseName });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("mensagem");
    });

    it("deve retornar 404 ao buscar curso inexistente", async () => {
      const response = await request(app).get("/api/cursos/99999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem");
    });

    it("deve retornar 404 ao atualizar curso inexistente", async () => {
      const response = await request(app)
        .put("/api/cursos/99999")
        .send({ name: "Teste" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem");
    });

    it("deve retornar 404 ao deletar curso inexistente", async () => {
      const response = await request(app).delete("/api/cursos/99999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem");
    });
  });
});
