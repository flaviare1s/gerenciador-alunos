import request from "supertest";
import { app } from "../../app.js";
import prisma from "../../src/config/database.js";

describe("Enrollments API", () => {
  let studentId;
  let courseId;

  const originalPrismaMethods = {
    enrollment: {
      findMany: prisma.enrollment.findMany,
      findUnique: prisma.enrollment.findUnique,
      create: prisma.enrollment.create,
      update: prisma.enrollment.update,
      delete: prisma.enrollment.delete,
    },
    student: {
      findUnique: prisma.student.findUnique,
    },
    course: {
      findUnique: prisma.course.findUnique,
    },
  };

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

  afterEach(() => {
    prisma.enrollment.findMany = originalPrismaMethods.enrollment.findMany;
    prisma.enrollment.findUnique = originalPrismaMethods.enrollment.findUnique;
    prisma.enrollment.create = originalPrismaMethods.enrollment.create;
    prisma.enrollment.update = originalPrismaMethods.enrollment.update;
    prisma.enrollment.delete = originalPrismaMethods.enrollment.delete;
    prisma.student.findUnique = originalPrismaMethods.student.findUnique;
    prisma.course.findUnique = originalPrismaMethods.course.findUnique;
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

      await prisma.enrollment.delete({ where: { id: response.body.id } });
    });

    it("deve listar todas as matriculas", async () => {
      const enrollment = await prisma.enrollment.create({
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

      await prisma.enrollment.delete({ where: { id: enrollment.id } });
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

      await prisma.enrollment.delete({ where: { id: enrollment.id } });
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

      await prisma.enrollment.delete({ where: { id: enrollment.id } });
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

      await prisma.enrollment.delete({ where: { id: firstResponse.body.id } });
    });
  });

  describe("Cenários de Erro Adicionais", () => {
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

    it("deve retornar 500 ao ocorrer erro inesperado ao listar matriculas", async () => {
      const originalFindMany = prisma.enrollment.findMany;
      prisma.enrollment.findMany = async () => {
        throw new Error("Database error");
      };

      const response = await request(app).get("/api/matriculas");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("mensagem");

      prisma.enrollment.findMany = originalFindMany;
    });

    it("deve retornar 500 ao ocorrer erro inesperado ao buscar matricula por ID", async () => {
      const originalFindUnique = prisma.enrollment.findUnique;
      prisma.enrollment.findUnique = async () => {
        throw new Error("Database error");
      };

      const response = await request(app).get("/api/matriculas/1");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("mensagem");

      prisma.enrollment.findUnique = originalFindUnique;
    });

    it("deve retornar 500 ao ocorrer erro inesperado ao criar matricula", async () => {
      const originalFindUnique = prisma.student.findUnique;
      prisma.student.findUnique = async () => {
        throw new Error("Database error");
      };

      const response = await request(app).post("/api/matriculas").send({
        studentId,
        courseId,
        completionDate: "2025-12-31",
      });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("mensagem");

      prisma.student.findUnique = originalFindUnique;
    });

    it("deve retornar 500 ao ocorrer erro inesperado ao atualizar matricula", async () => {
      const existingStudent = await prisma.student.findUnique({
        where: { id: studentId },
      });
      const existingCourse = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!existingStudent || !existingCourse) {
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
      }

      const testEnrollment = await prisma.enrollment.create({
        data: {
          studentId,
          courseId,
          completionDate: new Date("2027-12-31"),
          status: "IN_PROGRESS",
        },
      });

      const originalFindUnique = prisma.enrollment.findUnique;
      const originalUpdate = prisma.enrollment.update;

      let callCount = 0;
      prisma.enrollment.findUnique = async () => {
        callCount++;
        if (callCount === 1 || callCount === 2) {
          return testEnrollment;
        }
        throw new Error("Database error");
      };

      prisma.enrollment.update = async () => {
        throw new Error("Database error");
      };

      const response = await request(app)
        .put(`/api/matriculas/${testEnrollment.id}`)
        .send({ completionDate: "2025-11-30" });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("mensagem");

      prisma.enrollment.findUnique = originalFindUnique;
      prisma.enrollment.update = originalUpdate;

      await prisma.enrollment.delete({ where: { id: testEnrollment.id } });
    });

    it("deve retornar 500 ao ocorrer erro inesperado ao deletar matricula", async () => {
      const existingStudent = await prisma.student.findUnique({
        where: { id: studentId },
      });
      const existingCourse = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!existingStudent || !existingCourse) {
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
      }

      const testEnrollment = await prisma.enrollment.create({
        data: {
          studentId,
          courseId,
          completionDate: new Date("2028-12-31"),
          status: "IN_PROGRESS",
        },
      });

      const enrollmentId = testEnrollment.id;

      const originalFindUnique = prisma.enrollment.findUnique;
      const originalDelete = prisma.enrollment.delete;

      let callCount = 0;
      prisma.enrollment.findUnique = async () => {
        callCount++;
        if (callCount === 1) {
          return testEnrollment;
        }
        throw new Error("Database error");
      };

      prisma.enrollment.delete = async () => {
        throw new Error("Database error");
      };

      const response = await request(app).delete(
        `/api/matriculas/${enrollmentId}`
      );

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("mensagem");

      prisma.enrollment.findUnique = originalFindUnique;
      prisma.enrollment.delete = originalDelete;

      await prisma.enrollment
        .delete({ where: { id: enrollmentId } })
        .catch(() => {});
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
