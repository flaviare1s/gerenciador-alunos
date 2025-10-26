import { useEffect } from "react"
import { useState } from "react"
import { getAllAlunos } from "../services/aluno"
import { Aluno } from "./Aluno"

export const AlunosList = () => {
  const [alunos, setAlunos] = useState([])

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

  return (
    <div className="pt-[52px]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-border text-left">
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px] hidden md:table-cell">Data de cadastro</th>
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px]">Nome</th>
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px] hidden lg:table-cell">Estado</th>
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px] hidden sm:table-cell">Cursos</th>
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px]">Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno) => (
            <Aluno key={aluno.id} aluno={aluno} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
