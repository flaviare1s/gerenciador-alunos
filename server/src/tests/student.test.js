import request from "supertest";
import { app } from "../../server.js";
import prisma from "../../src/config/database.js";

describe("Students API", () => {
  beforeAll(async () => {
    await prisma.enrollment.deleteMany();
    await prisma.student.deleteMany();
    await prisma.student.create({
      data: {
        id: 1,
        firstName: "Estudante Inicial",
        lastName: "Souza",
        birthDate: "2002-10-10T00:00:00.000Z",
        cpf: "12345678903",
        gender: "MALE",
        email: "matheue@example.com",
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("Cenários Felizes", () => {
    it("deve criar um novo estudante", async () => {
      const newStudent = {
        firstName: "Ana",
        lastName: "Souza",
        birthDate: "2002-10-10T00:00:00.000Z",
        cpf: "12345678910",
        gender: "FEMALE",
        email: "ana@example.com",
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
      expect(response.body.lastName).toBe(newStudent.lastName);
      expect(response.body.email).toBe(newStudent.email);
    });

    it("deve listar todos os alunos", async () => {
      const response = await request(app).get("/api/alunos");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("deve retornar o estudante com ID 1", async () => {
      const response = await request(app).get("/api/alunos/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", 1);
      expect(response.body).toHaveProperty("firstName", "Estudante Inicial");
      expect(response.body).toHaveProperty("lastName", "Souza");
    });
  });

  it("deve retornar 400 ao tentar criar um aluno com dados inválidos", async () => {
    const response = await request(app).post("/api/alunos").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("mensagem", "Erro de validação");
  });
});
