import request from "supertest";
import { app } from "../../app.js";
import prisma from "../../src/config/database.js";

describe("Enrollments API", () => {
  let studentId;
  let courseId;

  beforeAll(async () => {
    // Clean database completely
    await prisma.enrollment.deleteMany();
    await prisma.student.deleteMany();
    await prisma.course.deleteMany();

    const student = await prisma.student.create({
      data: {
        firstName: "Aluno",
        lastName: "Teste",
        birthDate: "2000-01-01T00:00:00.000Z",
        cpf: "11111111111",
        gender: "MALE",
        email: "aluno.enrollment@example.com",
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
        name: "Curso Teste Enrollment",
      },
    });

    studentId = student.id;
    courseId = course.id;
  });

  beforeEach(async () => {
    await prisma.enrollment.deleteMany();
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
    });

    it("deve listar todas as matriculas", async () => {
      await prisma.enrollment.create({
        data: {
          studentId,
          courseId,
          completionDate: new Date("2025-12-31"),
          status: "IN_PROGRESS",
        },
      });

      const response = await request(app).get("/api/matriculas");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve obter a matricula pelo id", async () => {
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId,
          courseId,
          completionDate: new Date("2025-12-31"),
          status: "IN_PROGRESS",
        },
      });

      const response = await request(app).get(
        `/api/matriculas/${enrollment.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", enrollment.id);
      expect(response.body.studentId).toBe(studentId);
      expect(response.body.courseId).toBe(courseId);
    });

    it("deve atualizar uma matricula", async () => {
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId,
          courseId,
          completionDate: new Date("2025-12-31"),
          status: "IN_PROGRESS",
        },
      });

      const response = await request(app)
        .put(`/api/matriculas/${enrollment.id}`)
        .send({ completionDate: "2025-11-30" });

      expect(response.status).toBe(200);
      expect(response.body.completionDate).toBe("2025-11-30T00:00:00.000Z");
    });

    it("deve deletar uma matricula", async () => {
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId,
          courseId,
          completionDate: new Date("2025-12-31"),
          status: "IN_PROGRESS",
        },
      });

      const response = await request(app).delete(
        `/api/matriculas/${enrollment.id}`
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
      const firstResponse = await request(app).post("/api/matriculas").send({
        studentId,
        courseId,
        completionDate: "2025-12-31",
      });

      expect(firstResponse.status).toBe(201);

      const response = await request(app).post("/api/matriculas").send({
        studentId,
        courseId,
        completionDate: "2025-12-31",
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("mensagem");
    });

    it("deve retornar 404 ao criar matricula com aluno inexistente", async () => {
      const response = await request(app).post("/api/matriculas").send({
        studentId: 99999,
        courseId: courseId,
        completionDate: "2025-12-31",
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem");
    });

    it("deve retornar 404 ao criar matricula com curso inexistente", async () => {
      const response = await request(app).post("/api/matriculas").send({
        studentId: studentId,
        courseId: 99999,
        completionDate: "2025-12-31",
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem");
    });

    it("deve retornar 404 ao atualizar matricula inexistente", async () => {
      const response = await request(app)
        .put("/api/matriculas/99999")
        .send({ completionDate: "2025-11-30" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem");
    });
  });
});
