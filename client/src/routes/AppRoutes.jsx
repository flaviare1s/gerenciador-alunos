import { Routes, Route } from "react-router-dom";
import { Alunos } from "../pages/Alunos";
import { AlunoForm } from "../pages/AlunoForm";
import { CursoForm } from "../pages/CursoForm";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Alunos />} />
      <Route path="/cadastro-aluno" element={<AlunoForm />} />
      <Route path="/cadastro-curso" element={<CursoForm />} />
    </Routes>
  );
}
