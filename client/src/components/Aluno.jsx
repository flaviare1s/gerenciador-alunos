import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import { Link } from "react-router-dom";

export const Aluno = ({ aluno }) => {
  const [sliceCount, setSliceCount] = useState(1);

  useEffect(() => {
    const updateSliceCount = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setSliceCount(4);
      } else if (width >= 1024) {
        setSliceCount(3);
      } else if (width >= 870) {
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
    <Link to={`/edicao-aluno/${aluno.id}`} className="table-row hover:bg-gray-100 border-b border-gray-border">
      <div className="px-6 py-[30px] text-xs text-neutral-black hidden sm:table-cell">
        {formatDate(aluno.criadoEm)}
      </div>
      <div className="table-cell px-6 py-[30px] text-sm text-neutral-black font-medium">
        {aluno.nome} {aluno.sobrenome}
      </div>
      <div className="px-6 py-[30px] text-sm text-dark-gray hidden md:table-cell">
        {aluno.estado}
      </div>
      <div className="px-6 py-[30px] table-cell">
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
      </div>

      {/* Botões de ação escondidos, pois não estão no design */}
      <div className="hidden px-6 py-[30px] gap-4 items-center justify-center">
        <FaRegEdit className="text-secondary cursor-pointer text-xl" />
        <button className="text-primary cursor-pointer text-xl">
          <LuTrash2 />
        </button>
      </div>

    </Link>
  );
};
