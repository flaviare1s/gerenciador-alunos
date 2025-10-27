import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { ConfirmationModal } from "./ConfirmationModal";
import { deleteCourse } from "../services/course";
import ReactDOM from "react-dom";
import { useState } from "react";

export const Course = ({ course, onCourseDeleted }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCourse(course.id);
      toast.success("Curso deletado com sucesso!");
      if (onCourseDeleted) onCourseDeleted(course.id);
    } catch {
      toast.error("Erro ao deletar curso.");
    } finally {
      setModalOpen(false);
    }
  };

  return (
    <>
      <tr className="hover:bg-gray-100 border-b border-gray-border">
        <td className="px-2 py-[30px] text-sm text-neutral-black font-medium">
          {course.name}
        </td>
        <td className="px-2 py-[30px] text-right">
          <Link
            to={`/edicao-curso/${course.id}`}
            className="text-sm text-secondary font-medium hover:text-secondary/80 mr-4"
          >
            <FaRegEdit className="w-5 h-5 inline-block" />
          </Link>
          <button
            onClick={handleDeleteClick}
            className="text-sm text-primary font-medium hover:text-primary/80 cursor-pointer"
          >
            <FiTrash2 className="w-5 h-5 inline-block" />
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
