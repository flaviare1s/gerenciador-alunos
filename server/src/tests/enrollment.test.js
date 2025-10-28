import request from "supertest";
import { app } from "../../server.js";
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
        description: "Descrição do curso teste",
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
    it("should create a new enrollment", async () => {
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

    it("should list all enrollments", async () => {
      const response = await request(app).get("/api/matriculas");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should get enrollment by id", async () => {
      const response = await request(app).get(
        `/api/matriculas/${enrollmentId}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", enrollmentId);
      expect(response.body.studentId).toBe(studentId);
      expect(response.body.courseId).toBe(courseId);
    });

    it("should update an enrollment", async () => {
      const response = await request(app)
        .put(`/api/matriculas/${enrollmentId}`)
        .send({ completionDate: "2025-11-30" });

      expect(response.status).toBe(200);
      expect(response.body.completionDate).toBe("2025-11-30T00:00:00.000Z");
    });

    it("should delete an enrollment", async () => {
      const response = await request(app).delete(
        `/api/matriculas/${enrollmentId}`
      );
      expect(response.status).toBe(204);
    });
  });

  describe("Error Scenarios", () => {
    it("should return 404 when deleting non-existing enrollment", async () => {
      const response = await request(app).delete("/api/matriculas/99999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem");
    });

    it("should return 400 when creating enrollment with invalid data", async () => {
      const response = await request(app).post("/api/matriculas").send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("mensagem");
    });

    it("should return conflict when student already enrolled", async () => {
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
