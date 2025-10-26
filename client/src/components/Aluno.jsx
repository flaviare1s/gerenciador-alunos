import { FaRegEdit } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";

export const Aluno = ({ aluno }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <tr className="border-b border-gray-border">
      <td className="px-6 py-[30px] text-xs text-neutral-black hidden md:table-cell">{formatDate(aluno.criadoEm)}</td>
      <td className="px-6 py-[30px] text-sm text-neutral-black font-medium">{aluno.nome} {aluno.sobrenome}</td>
      <td className="px-6 py-[30px] text-sm text-dark-gray hidden lg:table-cell">{aluno.estado}</td>
      <td className="px-6 py-[30px] hidden sm:table-cell">
        <ul className="flex flex-wrap gap-2">
          {aluno.cursos.slice(0, 3).map((curso, index) => (
            <li
              key={index}
              className="text-xs bg-light-blue text-secondary px-3 py-1 rounded-full font-medium border border-secondary"
            >
              {curso}
            </li>
          ))}
          {aluno.cursos.length > 3 && (
            <li
              className="text-xs bg-gray-100 text-dark-gray px-3 py-1 rounded-full font-medium border border-light-gray"
            >
              +{aluno.cursos.length - 3}
            </li>
          )}
        </ul>
      </td>
      <td className="px-6 py-[30px] flex gap-4 items-center justify-center">
        <button className="text-secondary cursor-pointer"><FaRegEdit /></button>
        <button className="text-primary cursor-pointer"><LuTrash2 /></button>
      </td>
    </tr>
  );
};
