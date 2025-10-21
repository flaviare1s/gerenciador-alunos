import { Routes, Route } from "react-router-dom";
import { Alunos } from "../pages/Alunos";
import { CadastroAluno } from "../pages/CadastroAluno";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Alunos />} />
      <Route path="/cadastro-aluno" element={<CadastroAluno />} />
    </Routes>
  );
}
