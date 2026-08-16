import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";

export const app = express();

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://gerenciador-alunos-beta.vercel.app",
];

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : defaultOrigins;

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());
app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
