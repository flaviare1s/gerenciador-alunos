import request from "supertest";
import { app } from "../../server.js";
import prisma from "../../src/config/database.js";

describe("Students API", () => {
  let studentId;

  beforeAll(async () => {
    await prisma.enrollment.deleteMany();
    await prisma.student.deleteMany();
    const student = await prisma.student.create({
      data: {
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
    studentId = student.id;
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
      const updateData = {
        firstName: "Atualizado",
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
      };
      const response = await request(app)
        .put(`/api/alunos/${studentId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.mensagem).toBe("student atualizado com sucesso");
      expect(response.body.student.firstName).toBe("Atualizado");
    });

    it("deve deletar um aluno existente", async () => {
      const student = await prisma.student.create({
        data: {
          firstName: "Deletar",
          lastName: "Aluno",
          birthDate: "2000-01-01T00:00:00.000Z",
          cpf: "99999999999",
          gender: "MALE",
          email: "deletar@example.com",
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
});
