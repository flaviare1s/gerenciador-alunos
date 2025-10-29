import { useState } from "react";
import { Course } from "./Course";
import { Pagination } from "./Pagination";
import { HiOutlineArrowNarrowUp, HiOutlineArrowNarrowDown } from "react-icons/hi";

/**
 * Componente de listar cursos em uma tabela com paginação e ordenação.
 * 
 * Este componente exibe uma tabela de cursos, permitindo a ordenação pelo nome do curso e a navegação entre as páginas.
 * 
 * Ele contem o cabeçalho da tabela, gerencia o estado de ordenação e paginação, e renderiza os cursos usando o componente `Course`.
 * 
 * Também chama o componente `Pagination` para permitir a navegação entre as páginas de cursos.
 */

export const CourseList = ({ filteredItems = [], setItems }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 10;

  const handleCourseDeleted = (id) => {
    setItems(prev => prev.filter(c => c.id !== id));
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedItems = [...filteredItems].sort((a, b) => {
    const nameA = a.name?.trim() || "";
    const nameB = b.name?.trim() || "";
    if (!nameA && !nameB) return 0;
    if (!nameA) return sortOrder === "asc" ? 1 : -1;
    if (!nameB) return sortOrder === "asc" ? -1 : 1;
    const comparison = nameA.localeCompare(nameB);
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="pt-[52px] w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-border text-left">
            <th className="font-medium text-dark-gray text-xs px-2 py-[13px] text-left flex items-center gap-1">
              Nome do curso
              <button className="flex cursor-pointer" onClick={toggleSortOrder}>
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
            <th className="font-medium text-dark-gray text-xs px-2 py-[13px] text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((course) => (
            <Course
              key={course.id}
              course={course}
              onCourseDeleted={handleCourseDeleted}
            />
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={Math.ceil(sortedItems.length / itemsPerPage)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
