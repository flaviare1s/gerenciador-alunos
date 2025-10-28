import request from "supertest";
import { app } from "../../app.js";
import prisma from "../../src/config/database.js";

beforeAll(async () => {
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();

  await prisma.course.create({
    data: {
      id: 1,
      name: "Curso de Teste Inicial",
    },
  });
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

describe("GET /api/cursos/1", () => {
  it("deve retornar o curso com ID 1", async () => {
    const response = await request(app).get("/api/cursos/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
  });
});

describe("PUT /api/cursos/1", () => {
  it("deve atualizar o curso com ID 1 e retornar status 200", async () => {
    const UpdatedCourse = {
      name: `Curso de Teste Atualizado ${Date.now()}`,
    };

    const response = await request(app)
      .put("/api/cursos/1")
      .send(UpdatedCourse);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(UpdatedCourse.name);
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
  });
});

describe("DELETE /api/cursos/1", () => {
  it("deve deletar o curso com ID 1 e retornar status 204", async () => {
    const response = await request(app).delete("/api/cursos/1");

    expect(response.status).toBe(204);
  });
});

describe("Cenários de erro para cursos", () => {
  it("deve retornar 404 ao buscar um curso inexistente", async () => {
    const response = await request(app).get("/api/cursos/9999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("mensagem", "Curso não encontrado");
  });

  it("deve retornar 404 ao tentar atualizar um curso inexistente", async () => {
    const response = await request(app)
      .put("/api/cursos/9999")
      .send({ name: "Curso Inexistente" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("mensagem", "Curso não encontrado");
  });

  it("deve retornar 404 ao tentar deletar um curso inexistente", async () => {
    const response = await request(app).delete("/api/cursos/9999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("mensagem", "Curso não encontrado");
  });

  it("deve retornar 400 ao tentar criar um curso com dados inválidos", async () => {
    const response = await request(app).post("/api/cursos").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("mensagem", "Erro de validação");
  });
});
