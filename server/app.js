import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";

export const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gerenciador-alunos-beta.vercel.app",
    ],
  })
);

app.use(express.json());
app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
