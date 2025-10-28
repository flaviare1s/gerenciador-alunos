import request from "supertest";
import { app } from "../../app.js";
import prisma from "../../src/config/database.js";

describe("Enrollments API", () => {
  let studentId;
  let courseId;
  let enrollmentId;

  beforeAll(async () => {
    await prisma.enrollment.deleteMany();
    await prisma.student.deleteMany();
    await prisma.course.deleteMany();

    const student = await prisma.student.create({
      data: {
        firstName: "Aluno",
        lastName: "Teste",
        birthDate: "2000-01-01T00:00:00.000Z",
        cpf: "12345678901",
        gender: "MALE",
        email: "aluno@example.com",
        zipCode: "60000000",
        street: "Rua Teste",
        number: "100",
        complement: "Apto 1",
        neighborhood: "Centro",
        city: "Fortaleza",
        state: "CE",
        country: "Brasil",
      },
    });

    const course = await prisma.course.create({
      data: {
        name: "Curso Teste",
      },
    });

    studentId = student.id;
    courseId = course.id;
  });

  afterAll(async () => {
    await prisma.enrollment.deleteMany();
    await prisma.student.deleteMany();
    await prisma.course.deleteMany();
    await prisma.$disconnect();
  });

  describe("Happy Path", () => {
    it("deve criar uma nova matricula", async () => {
      const response = await request(app).post("/api/matriculas").send({
        studentId,
        courseId,
        completionDate: "2025-12-31",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.studentId).toBe(studentId);
      expect(response.body.courseId).toBe(courseId);

      enrollmentId = response.body.id;
    });

    it("deve listar todas as matriculas", async () => {
      const response = await request(app).get("/api/matriculas");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve obter a matricula pelo id", async () => {
      const response = await request(app).get(
        `/api/matriculas/${enrollmentId}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", enrollmentId);
      expect(response.body.studentId).toBe(studentId);
      expect(response.body.courseId).toBe(courseId);
    });

    it("deve atualizar uma matricula", async () => {
      const response = await request(app)
        .put(`/api/matriculas/${enrollmentId}`)
        .send({ completionDate: "2025-11-30" });

      expect(response.status).toBe(200);
      expect(response.body.completionDate).toBe("2025-11-30T00:00:00.000Z");
    });

    it("deve deletar uma matricula", async () => {
      const response = await request(app).delete(
        `/api/matriculas/${enrollmentId}`
      );
      expect(response.status).toBe(204);
    });
  });

  describe("Cenários de Erro", () => {
    it("deve retornar 404 ao deletar matricula inexistente", async () => {
      const response = await request(app).delete("/api/matriculas/99999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem");
    });

    it("deve retornar 400 ao criar matricula com dados invalidos", async () => {
      const response = await request(app).post("/api/matriculas").send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("mensagem");
    });

    it("deve retornar 409 quando aluno ja estiver matriculado", async () => {
      await request(app).post("/api/matriculas").send({
        studentId,
        courseId,
        completionDate: "2025-12-31",
      });

      const response = await request(app).post("/api/matriculas").send({
        studentId,
        courseId,
        completionDate: "2025-12-31",
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("mensagem");
    });
  });
});
