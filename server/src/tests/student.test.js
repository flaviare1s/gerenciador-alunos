import request from "supertest";
import { app } from "../../server.js";

describe("GET /api/students", () => {
  it("deve listar todos os alunos", async () => {
    const response = await request(app).get("/api/alunos");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
