import { useState, useEffect } from "react";
import { StudentList } from "../components/StudentList";
import { SearchBar } from "../components/SearchBar";
import { getAllStudents } from "../services/student";

/**
 * Página de listagem de alunos.
 * 
 * Esta página exibe uma tabela de alunos, permitindo a navegação entre as páginas e a busca por alunos.
 * 
 * Utiliza o componente `StudentList` para exibir os alunos e o componente `SearchBar` para permitir a busca por alunos.
 */

export const Students = () => {
  const [students, setstudents] = useState([]);
  const [search, setSearch] = useState("");

  const filteredstudents = search
    ? students.filter((student) =>
      [student.firstName, student.lastName].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    )
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
