import { Routes, Route, Navigate } from "react-router-dom";
import { StudentForm } from "../pages/StudentForm";
import { CourseForm } from "../pages/CourseForm";
import { Students } from "../pages/Students";
import { Courses } from "../pages/Courses";
import { NotFound } from "../pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/alunos" replace />} />

      <Route
        path="/alunos"
        element={
      
            <Students />
       
        }
      />
      <Route
        path="/cursos"
        element={
      
            <Courses />
       
        }
      />

      <Route path="/cadastro-aluno" element={<StudentForm />} />
      <Route path="/edicao-aluno/:id" element={<StudentForm />} />
      <Route path="/cadastro-curso" element={<CourseForm />} />
      <Route path="/edicao-curso/:id" element={<CourseForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
