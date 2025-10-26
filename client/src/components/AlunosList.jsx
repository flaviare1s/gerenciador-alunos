import { Aluno } from "./Aluno"

export const AlunosList = ({ filteredAlunos = [] }) => {

  return (
    <div className="pt-[52px] w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-border text-left">
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px] hidden sm:table-cell">Data de cadastro</th>
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px]">Nome</th>
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px] hidden md:table-cell">Estado</th>
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px] table-cell">Cursos</th>
            
            {/* Coluna de ações escondida, pois não está no design */}
            <th className="hidden font-medium text-dark-gray text-xs px-6 py-[13px]">Ações</th>

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
