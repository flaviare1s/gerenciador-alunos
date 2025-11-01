import request from "supertest";
import { app } from "../../app.js";
import prisma from "../../src/config/database.js";

describe("Students API", () => {
  let studentId;
  let testCounter = 0;

  const originalPrismaMethods = {
    student: {
      findMany: prisma.student.findMany,
      findUnique: prisma.student.findUnique,
      create: prisma.student.create,
      update: prisma.student.update,
      delete: prisma.student.delete,
    },
  };

  beforeAll(async () => {
    await prisma.enrollment.deleteMany();
    await prisma.student.deleteMany();
  });

  beforeEach(async () => {
    testCounter++;
    const student = await prisma.student.create({
      data: {
        firstName: "Estudante Inicial",
        lastName: "Souza",
        birthDate: "2002-10-10T00:00:00.000Z",
        cpf: `${10000000000 + testCounter}`,
        gender: "MALE",
        email: `teste${testCounter}@example.com`,
        zipCode: "60115060",
        street: "Rua das Palmeiras",
        number: "123",
        complement: "Apto 402",
        neighborhood: "Aldeota",
        city: "Fortaleza",
        state: "CE",
        country: "Brasil",
      },
    });
    studentId = student.id;
  });

  afterEach(async () => {
    prisma.student.findMany = originalPrismaMethods.student.findMany;
    prisma.student.findUnique = originalPrismaMethods.student.findUnique;
    prisma.student.create = originalPrismaMethods.student.create;
    prisma.student.update = originalPrismaMethods.student.update;
    prisma.student.delete = originalPrismaMethods.student.delete;

    if (studentId) {
      await prisma.enrollment.deleteMany({ where: { studentId } });
      await prisma.student.delete({ where: { id: studentId } }).catch(() => {});
    }
  });

  afterAll(async () => {
    await prisma.enrollment.deleteMany();
    await prisma.student.deleteMany();
    await prisma.$disconnect();
  });

  describe("Cenários Felizes", () => {
    it("deve criar um novo estudante", async () => {
      const uniqueId = Date.now();
      const newStudent = {
        firstName: "Ana",
        lastName: "Souza",
        birthDate: "2002-10-10T00:00:00.000Z",
        cpf: `${20000000000 + uniqueId}`.slice(0, 11),
        gender: "FEMALE",
        email: `ana${uniqueId}@example.com`,
        zipCode: "60115060",
        street: "Rua das Palmeiras",
        number: "123",
        complement: "Apto 402",
        neighborhood: "Aldeota",
        city: "Fortaleza",
        state: "CE",
        country: "Brasil",
      };

      const response = await request(app).post("/api/alunos").send(newStudent);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.firstName).toBe(newStudent.firstName);
    });

    it("deve listar todos os alunos", async () => {
      const response = await request(app).get("/api/alunos");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve retornar o estudante pelo ID", async () => {
      const response = await request(app).get(`/api/alunos/${studentId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", studentId);
      expect(response.body).toHaveProperty("firstName", "Estudante Inicial");
    });

    it("deve atualizar um aluno existente", async () => {
      const uniqueId = Date.now();
      const updateData = {
        firstName: "Atualizado",
        lastName: "Souza",
        birthDate: "2002-10-10T00:00:00.000Z",
        cpf: `${30000000000 + uniqueId}`.slice(0, 11),
        gender: "MALE",
        email: `atualizado${uniqueId}@example.com`,
        zipCode: "60115060",
        street: "Rua das Palmeiras",
        number: "123",
        complement: "Apto 402",
        neighborhood: "Aldeota",
        city: "Fortaleza",
        state: "CE",
        country: "Brasil",
      };
      const response = await request(app)
        .put(`/api/alunos/${studentId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.mensagem).toBe("Aluno atualizado com sucesso");
      expect(response.body.student.firstName).toBe("Atualizado");
    });

    it("deve deletar um aluno existente", async () => {
      const uniqueId = Date.now();
      const student = await prisma.student.create({
        data: {
          firstName: "Deletar",
          lastName: "Aluno",
          birthDate: "2000-01-01T00:00:00.000Z",
          cpf: `${40000000000 + uniqueId}`.slice(0, 11),
          gender: "MALE",
          email: `deletar${uniqueId}@example.com`,
          zipCode: "60115060",
          street: "Rua X",
          number: "10",
          neighborhood: "Centro",
          city: "Fortaleza",
          state: "CE",
          country: "Brasil",
        },
      });

      const response = await request(app).delete(`/api/alunos/${student.id}`);
      expect(response.status).toBe(204);
    });
  });

  describe("Cenários de Erro", () => {
    it("deve retornar 400 ao tentar criar um aluno com dados inválidos", async () => {
      const response = await request(app).post("/api/alunos").send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("mensagem", "Erro de validação");
    });

    it("deve retornar 404 ao buscar um aluno inexistente", async () => {
      const response = await request(app).get("/api/alunos/99999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem", "Aluno não encontrado");
    });

    it("deve retornar 404 ao tentar deletar aluno inexistente", async () => {
      const response = await request(app).delete("/api/alunos/99999");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem", "Aluno não encontrado");
    });

    it("deve retornar 400 ao tentar atualizar aluno com dados inválidos", async () => {
      const response = await request(app)
        .put(`/api/alunos/${studentId}`)
        .send({ cpf: "inválido" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("mensagem", "Erro de validação");
    });
  });

  describe("Cenários de Erro Adicionais", () => {
    it("deve retornar 400 ao criar aluno com CPF duplicado", async () => {
      const uniqueId = Date.now();
      const duplicateCpf = `${50000000000 + uniqueId}`.slice(0, 11);

      await request(app)
        .post("/api/alunos")
        .send({
          firstName: "Primeiro",
          lastName: "Aluno",
          birthDate: "2002-10-10T00:00:00.000Z",
          cpf: duplicateCpf,
          gender: "MALE",
          email: `primeiro${uniqueId}@example.com`,
          zipCode: "60115060",
          street: "Rua das Palmeiras",
          number: "123",
          complement: "Apto 402",
          neighborhood: "Aldeota",
          city: "Fortaleza",
          state: "CE",
          country: "Brasil",
        });

      const response = await request(app)
        .post("/api/alunos")
        .send({
          firstName: "Segundo",
          lastName: "Aluno",
          birthDate: "2002-10-10T00:00:00.000Z",
          cpf: duplicateCpf,
          gender: "MALE",
          email: `segundo${uniqueId}@example.com`,
          zipCode: "60115060",
          street: "Rua das Palmeiras",
          number: "123",
          complement: "Apto 402",
          neighborhood: "Aldeota",
          city: "Fortaleza",
          state: "CE",
          country: "Brasil",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("mensagem", "Erro de validação");
      expect(response.body).toHaveProperty("erros");
    });

    it("deve retornar 500 ao ocorrer erro inesperado ao listar alunos", async () => {
      const originalFindMany = prisma.student.findMany;
      prisma.student.findMany = async () => {
        throw new Error("Database error");
      };

      const response = await request(app).get("/api/alunos");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("mensagem");

      prisma.student.findMany = originalFindMany;
    });

    it("deve retornar 500 ao ocorrer erro inesperado ao buscar aluno por ID", async () => {
      const originalFindUnique = prisma.student.findUnique;
      prisma.student.findUnique = async () => {
        throw new Error("Database error");
      };

      const response = await request(app).get(`/api/alunos/${studentId}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("mensagem");

      prisma.student.findUnique = originalFindUnique;
    });

    it("deve retornar 500 ao ocorrer erro inesperado ao criar aluno", async () => {
      const originalCreate = prisma.student.create;
      prisma.student.create = async () => {
        throw new Error("Database error");
      };

      const uniqueId = Date.now();
      const response = await request(app)
        .post("/api/alunos")
        .send({
          firstName: "Erro",
          lastName: "Test",
          birthDate: "2002-10-10T00:00:00.000Z",
          cpf: `${60000000000 + uniqueId}`.slice(0, 11),
          gender: "MALE",
          email: `erro${uniqueId}@example.com`,
          zipCode: "60115060",
          street: "Rua das Palmeiras",
          number: "123",
          complement: "Apto 402",
          neighborhood: "Aldeota",
          city: "Fortaleza",
          state: "CE",
          country: "Brasil",
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("mensagem");

      prisma.student.create = originalCreate;
    });

    it("deve retornar 500 ao ocorrer erro inesperado ao atualizar aluno", async () => {
      const originalFindUnique = prisma.student.findUnique;
      const originalUpdate = prisma.student.update;

      let callCount = 0;
      prisma.student.findUnique = async () => {
        callCount++;
        if (callCount === 1) {
          return { id: studentId, firstName: "Test" };
        }
        throw new Error("Database error");
      };

      prisma.student.update = async () => {
        throw new Error("Database error");
      };

      const uniqueId = Date.now();
      const response = await request(app)
        .put(`/api/alunos/${studentId}`)
        .send({
          firstName: "Update Erro",
          lastName: "Test",
          birthDate: "2002-10-10T00:00:00.000Z",
          cpf: `${70000000000 + uniqueId}`.slice(0, 11),
          gender: "MALE",
          email: `updateerro${uniqueId}@example.com`,
          zipCode: "60115060",
          street: "Rua das Palmeiras",
          number: "123",
          complement: "Apto 402",
          neighborhood: "Aldeota",
          city: "Fortaleza",
          state: "CE",
          country: "Brasil",
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("mensagem");

      prisma.student.findUnique = originalFindUnique;
      prisma.student.update = originalUpdate;
    });

    it("deve retornar 500 ao ocorrer erro inesperado ao deletar aluno", async () => {
      const originalFindUnique = prisma.student.findUnique;
      const originalDeleteMany = prisma.enrollment.deleteMany;
      const originalDelete = prisma.student.delete;

      let callCount = 0;
      prisma.student.findUnique = async () => {
        callCount++;
        if (callCount === 1) {
          return { id: studentId, firstName: "Test" };
        }
        throw new Error("Database error");
      };

      prisma.enrollment.deleteMany = async () => ({});

      prisma.student.delete = async () => {
        throw new Error("Database error");
      };

      const response = await request(app).delete(`/api/alunos/${studentId}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("mensagem");

      prisma.student.findUnique = originalFindUnique;
      prisma.enrollment.deleteMany = originalDeleteMany;
      prisma.student.delete = originalDelete;
    });
  });
});
