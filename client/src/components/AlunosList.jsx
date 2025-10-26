import { useState } from "react";
import { Aluno } from "./Aluno";
import { HiOutlineArrowNarrowDown, HiOutlineArrowNarrowUp } from "react-icons/hi";
import { Pagination } from "./Pagination";

export const AlunosList = ({ filteredAlunos = [] }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortAlunos = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    filteredAlunos.sort((a, b) => {
      const dateA = new Date(a.criadoEm);
      const dateB = new Date(b.criadoEm);

      if (newOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAlunos = filteredAlunos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="pt-[52px] w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-border text-left">
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px] hidden sm:flex items-center gap-1">
              Data de cadastro
              <button className="flex cursor-pointer" onClick={sortAlunos}>
                {sortOrder === "asc" ? (
                  <>
                    <HiOutlineArrowNarrowUp className="text-secondary -mr-1.5" />
                    <HiOutlineArrowNarrowDown />
                  </>
                ) : (
                  <>
                    <HiOutlineArrowNarrowDown className="text-secondary -mr-1.5" />
                    <HiOutlineArrowNarrowUp />
                  </>
                )}
              </button>
            </th>
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px]">Nome</th>
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px] hidden md:table-cell">Estado</th>
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px] table-cell">Cursos</th>

            {/* Coluna de ações escondida, pois não está no design */}
            <th className="hidden font-medium text-dark-gray text-xs px-6 py-[13px]">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentAlunos.map((aluno) => (
            <Aluno key={aluno.id} aluno={aluno} />
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={Math.ceil(filteredAlunos.length / itemsPerPage)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
