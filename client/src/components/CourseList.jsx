import { useState } from "react";
import { Course } from "./Course";
import { Pagination } from "./Pagination";

export const CourseList = ({ filteredItems = [], setItems }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleCourseDeleted = (id) => {
    setItems(prev => prev.filter(c => c.id !== id));
  };

  const sortedItems = [...filteredItems].sort((a, b) => {
    const nameA = a.nome || "";
    const nameB = b.nome || "";
    return nameA.localeCompare(nameB);
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="pt-[52px] w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-border text-left">
            <th className="font-medium text-dark-gray text-xs px-6 py-[13px]">Nome do curso</th>
            <th className="table-cell font-medium text-dark-gray text-xs px-6 py-[13px]">Ações</th>
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
