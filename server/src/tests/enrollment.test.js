import request from "supertest";
import { app } from "../../server.js";

describe("GET /api/enrollments", () => {
  it("deve listar todas as matrículas", async () => {
    const response = await request(app).get("/api/matriculas");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
