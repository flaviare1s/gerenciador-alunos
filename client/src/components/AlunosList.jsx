import { Aluno } from "./Aluno"

export const AlunosList = ({ filteredAlunos = [] }) => {

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
          {filteredAlunos.map((aluno) => (
            <Aluno key={aluno.id} aluno={aluno} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
