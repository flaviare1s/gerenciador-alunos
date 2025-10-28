import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";
import { swaggerUi, swaggerSpec } from "./swagger.js";

dotenv.config();

export const app = express();

app.use(
  cors("http://localhost:5173", "https://gerenciador-alunos-beta.vercel.app")
);
app.use(express.json());

app.use("/api", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log("Documentação disponível em http://localhost:3000/api-docs");
});
