import { useState, useEffect } from "react";
import { StudentList } from "../components/StudentList";
import { SearchBar } from "../components/SearchBar";
import { getAllAlunos } from "../services/student";

export const Students = () => {
  const [alunos, setAlunos] = useState([]);
  const [search, setSearch] = useState("");

  const filteredAlunos = search
    ? alunos.filter((aluno) =>
      [aluno.nome, aluno.sobrenome].some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
    )
    : alunos;

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const data = await getAllAlunos();
        setAlunos(data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };
    fetchAlunos();
  }, []);

  return (
    <div>
      <SearchBar alunos={alunos} setSearch={setSearch} search={search} />
      <StudentList filteredAlunos={filteredAlunos} />
    </div>
  );
};
