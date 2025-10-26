import { Routes, Route } from "react-router-dom";
import { Alunos } from "../pages/Alunos";
import { CadastroAluno } from "../pages/CadastroAluno";
import { CadastroCurso } from "../pages/CadastroCurso";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Alunos />} />
      <Route path="/cadastro-aluno" element={<CadastroAluno />} />
      <Route path="/cadastro-curso" element={<CadastroCurso />} />
    </Routes>
  );
}
