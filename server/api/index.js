import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "../src/routes/index.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

const app = express();

app.use(cors("https://gerenciador-alunos-delta.vercel.app"));
app.use(express.json());
app.use("/api", routes);

export default app;
