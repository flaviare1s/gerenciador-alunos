import { useState } from "react"
import { AlunosList } from "../components/AlunosList"
import { SearchBar } from "../components/SearchBar"
import { useEffect } from "react"
import { getAllAlunos } from "../services/aluno"

export const Alunos = () => {
  const [alunos, setAlunos] = useState([])
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
    }
    fetchAlunos();
  }, [])
  useEffect(() => {}, [alunos, search, filteredAlunos])
  return (
    <div>
      <SearchBar alunos={alunos} setSearch={setSearch} search={search} />
      <AlunosList filteredAlunos={filteredAlunos} />
    </div>
  )
}
