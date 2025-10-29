import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { ConfirmationModal } from "./ConfirmationModal";
import { deleteStudent } from "../services/student";
import ReactDOM from "react-dom";

/**
 * Componente de listar um aluno específico na tabela de alunos.
 * 
 * Esse componente representa uma linha da tabela de alunos, exibindo a data de cadastro, o nome, o estado e os botões para editar ou excluir o aluno. Essa exibição é responsiva, adaptando a quantidade de cursos exibidos conforme o tamanho da tela. Escondi alguns campos em telas menores para melhorar a usabilidade.
 */

export const Student = ({ student, onStudentDeleted }) => {
  const [sliceCount, setSliceCount] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setStudentIdToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentIdToDelete) return;

    try {
      await deleteStudent(studentIdToDelete);
      toast.success("Aluno deletado com sucesso!");
      if (onStudentDeleted) {
        onStudentDeleted(studentIdToDelete);
      }
    } catch {
      toast.error("Erro ao deletar aluno.");
    } finally {
      setModalOpen(false);
      setStudentIdToDelete(null);
    }
  };

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
    <>
      <tr className="hover:bg-gray-100 border-b border-gray-border">
        <td className="px-2 py-[30px] text-xs text-neutral-black hidden sm:table-cell">
          {formatDate(student.createdAt)}
        </td>
        <td className="table-cell px-2 py-[30px] text-sm text-neutral-black font-medium">
          {student.firstName} {student.lastName}
        </td>
        <td className="px-2 py-[30px] text-sm text-dark-gray hidden md:table-cell">
          {student.state}
        </td>
        <td className="px-2 py-[30px] table-cell">
          <ul className="flex flex-wrap gap-2">
            {student.courses.slice(0, sliceCount).map((course, index) => (
              <li
                key={index}
                className="text-xs bg-bg-badge text-secondary px-3 py-1 rounded-full font-medium border border-light-blue"
              >
                {course}
              </li>
            ))}
            {student.courses.length > sliceCount && (
              <li className="text-xs bg-gray-100 text-dark-gray px-3 py-1 rounded-full font-medium border border-light-gray">
                +{student.courses.length - sliceCount}
              </li>
            )}
          </ul>
        </td>
        <td className="py-[30px] flex items-center gap-4 px-2">
          <Link
            to={`/edicao-aluno/${student.id}`}
            className="text-sm text-secondary font-medium hover:text-secondary/80"
          >
            <FaRegEdit className="w-5 h-5" />
          </Link>
          <button
            onClick={() => handleDeleteClick(student.id)}
            className="text-sm text-primary font-medium hover:text-primary/80 cursor-pointer"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </td>
      </tr>
      {ReactDOM.createPortal(
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={confirmDelete}
        />,
        document.body
      )}
    </>
  );
};
