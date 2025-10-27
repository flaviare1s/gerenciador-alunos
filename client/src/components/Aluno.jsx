import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Aluno = ({ aluno }) => {
  const [sliceCount, setSliceCount] = useState(1);

  useEffect(() => {
    const updateSliceCount = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setSliceCount(4);
      } else if (width >= 968) {
        setSliceCount(3);
      } else if (width >= 640) {
        setSliceCount(2);
      } else {
        setSliceCount(1);
      }
    };

    updateSliceCount();
    window.addEventListener("resize", updateSliceCount);
    return () => window.removeEventListener("resize", updateSliceCount);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <tr className="hover:bg-gray-100 border-b border-gray-border">
      <td className="px-6 py-[30px] text-xs text-neutral-black hidden sm:table-cell">
        {formatDate(aluno.criadoEm)}
      </td>
      <td className="table-cell px-6 py-[30px] text-sm text-neutral-black font-medium">
        <Link to={`/edicao-aluno/${aluno.id}`} className="block">
          {aluno.nome} {aluno.sobrenome}
        </Link>
      </td>
      <td className="px-6 py-[30px] text-sm text-dark-gray hidden md:table-cell">
        {aluno.estado}
      </td>
      <td className="px-6 py-[30px] table-cell">
        <ul className="flex flex-wrap gap-2">
          {aluno.cursos.slice(0, sliceCount).map((curso, index) => (
            <li
              key={index}
              className="text-xs bg-bg-badge text-secondary px-3 py-1 rounded-full font-medium border border-light-blue"
            >
              {curso}
            </li>
          ))}
          {aluno.cursos.length > sliceCount && (
            <li className="text-xs bg-gray-100 text-dark-gray px-3 py-1 rounded-full font-medium border border-light-gray">
              +{aluno.cursos.length - sliceCount}
            </li>
          )}
        </ul>
      </td>
    </tr>
  );
};
