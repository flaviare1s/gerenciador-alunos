import { Routes, Route } from "react-router-dom";
import { StudentForm } from "../pages/StudentForm";
import { CourseForm } from "../pages/CourseForm";
import { Students } from "../pages/Students";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Students />} />
      <Route path="/cadastro-student" element={<StudentForm />} />
      <Route path="/edicao-student/:id" element={<StudentForm />} />
      <Route path="/cadastro-course" element={<CourseForm />} />
      <Route path="/edicao-course/:id" element={<CourseForm />} />
    </Routes>
  );
}
