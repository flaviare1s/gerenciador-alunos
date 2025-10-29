import { useState } from "react";
import { Student } from "./Student";
import { HiOutlineArrowNarrowDown, HiOutlineArrowNarrowUp } from "react-icons/hi";
import { Pagination } from "./Pagination";

/**
 * Componente de listar alunos em uma tabela com paginação e ordenação.
 * 
 * Este componente exibe uma tabela de alunos, permitindo a ordenação pela data de cadastro do aluno e a navegação entre as páginas.
 * 
 * Ele contem o cabeçalho da tabela, gerencia o estado de ordenação e paginação, e renderiza os alunos usando o componente `Student`.
 * 
 * Também chama o componente `Pagination` para permitir a navegação entre as páginas de alunos.
 */

export const StudentList = ({ filteredstudents = [], setStudents }) => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleStudentDeleted = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const sortstudents = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    filteredstudents.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (newOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentstudents = filteredstudents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="pt-[52px] w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-border text-left">
            <th className="font-medium text-dark-gray text-xs px-2 py-[13px] hidden sm:flex items-center gap-1">
              Data de cadastro
              <button className="flex cursor-pointer" onClick={sortstudents}>
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
            <th className="font-medium text-dark-gray text-xs px-2 py-[13px]">Nome</th>
            <th className="font-medium text-dark-gray text-xs px-2 py-[13px] hidden md:table-cell">Estado</th>
            <th className="font-medium text-dark-gray text-xs px-2 py-[13px] table-cell">Cursos</th>
            <th className="table-cell font-medium text-dark-gray text-xs px-2 py-[13px]">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentstudents.map((student) => (
            <Student
              key={student.id}
              student={student}
              onStudentDeleted={handleStudentDeleted}
            />
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={Math.ceil(filteredstudents.length / itemsPerPage)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
