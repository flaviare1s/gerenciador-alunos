import { Routes, Route } from "react-router-dom";
import { RedirectTo } from "../components/RedirectTo";
import { Login } from "../pages/Login";
import { Alunos } from "../pages/Alunos";
import { CadastroAluno } from "../pages/CadastroAluno";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RedirectTo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/alunos" element={<Alunos />} />
      <Route path="/cadastro-aluno" element={<CadastroAluno />} />
    </Routes>
  );
}
