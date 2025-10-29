import { Link } from "react-router-dom";
import addIcon from "../assets/img/Add.png";
import { MdOutlineLibraryAdd } from "react-icons/md";

export const AddButton = ({ type = "student" }) => {
  return (
    <Link
      to={type === "student" ? "/cadastro-aluno" : "/cadastro-curso"}
      className="flex items-center justify-center gap-2 py-2 px-6 text-neutral-black text-sm border border-gray-medium rounded-md cursor-pointer hover:bg-gray-light hover:text-primary w-full sm:w-auto"
      data-testid="add-button"
    >
      <span className="w-6 h-6 flex items-center justify-center">
        {type === "student" ? (
          <img className="w-full mt-1" src={addIcon} alt="" aria-hidden="true" />
        ) : (
          <MdOutlineLibraryAdd className="text-primary text-2xl" />
        )}
      </span>
      <span>Adicionar</span>
    </Link>
  );
};
