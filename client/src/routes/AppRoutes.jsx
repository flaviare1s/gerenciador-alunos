import { Routes, Route } from "react-router-dom";
import { StudentForm } from "../pages/StudentForm";
import { CourseForm } from "../pages/CourseForm";
import { Students } from "../pages/Students";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Students />} />
      <Route path="/cadastro-aluno" element={<StudentForm />} />
      <Route path="/edicao-aluno/:id" element={<StudentForm />} />
      <Route path="/cadastro-curso" element={<CourseForm />} />
      <Route path="/edicao-curso/:id" element={<CourseForm />} />
    </Routes>
  );
}
