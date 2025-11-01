import { Link } from "react-router-dom";
import addIcon from "../assets/img/Add.png";
import { MdOutlineLibraryAdd } from "react-icons/md";

/**
 * Componente reutilizável de "botão Adicionar".
 * 
 * Este "botão" (na verdade é um Link) é usado para navegar para as páginas de cadastro de alunos ou cursos.
 * O tipo de cadastro é definido pelo prop `type`, que altera o link e o ícone exibido.
 * 
 * Props:
 *  - type: "student" | "course" (padrão: "student")
 * 
 * A rota é definida com base no valor do prop `type`:
 *  - "student": navega para "/cadastro-aluno"
 *  - "course": navega para "/cadastro-curso"
 */

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
