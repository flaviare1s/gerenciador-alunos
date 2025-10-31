import { useState, useEffect } from "react";
import { StudentList } from "../components/StudentList";
import { SearchBar } from "../components/SearchBar";
import { getAllStudents } from "../services/student";

/**
 * Página de listagem de alunos.
 * Esta página exibe uma tabela de alunos, permitindo a navegação entre as páginas e a busca por alunos.
 * Utiliza o componente `StudentList` para exibir os alunos e o componente `SearchBar` para permitir a busca por alunos (nome, sobrenome, estado ou curso).
 */

export const Students = () => {
  const [students, setstudents] = useState([]);
  const [search, setSearch] = useState("");

  const filteredstudents = search
    ? students.filter((student) => {
      const fields = [student.firstName, student.lastName, student.state].filter(Boolean);
      const courses = student.courses || [];

      return (
        fields.some((field) => field.toLowerCase().includes(search.toLowerCase())) ||
        courses.some((course) => course.toLowerCase().includes(search.toLowerCase()))
      );
    })
    : students;

  useEffect(() => {
    const fetchstudents = async () => {
      try {
        const data = await getAllStudents();
        setstudents(data);
      } catch (error) {
        console.error("Erro ao buscar students:", error);
      }
    };
    fetchstudents();
  }, []);

  console.log("Termo de busca:", search);
  console.log("Alunos filtrados:", filteredstudents);

  return (
    <div>
      <SearchBar
        students={students}
        setSearch={setSearch}
        search={search}
      />
      <StudentList
        filteredstudents={filteredstudents}
        setStudents={setstudents}
      />
    </div>
  );
};
