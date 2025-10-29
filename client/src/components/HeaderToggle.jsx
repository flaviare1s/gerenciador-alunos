import { useLocation, useNavigate } from "react-router-dom";

/**
 * Componente de alternância entre as páginas de "Alunos" e "Cursos".
 * 
 * Este componente exibe um toggle switch que permite ao usuário alternar entre as páginas de "Alunos" e "Cursos".
 * A navegação é realizada utilizando o hook `useNavigate` do React Router.
 */

export const HeaderToggle = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const togglePage = () => {
    if (location.pathname === "/alunos") {
      navigate("/cursos");
    } else {
      navigate("/alunos");
    }
  };

  const isAlunos = location.pathname === "/alunos";

  return (
    <div className="relative w-32 h-10 cursor-pointer select-none" onClick={togglePage}>
      <div className="absolute inset-0 bg-primary rounded-full transition-colors duration-300"></div>

      <div
        className={`absolute top-1 w-14 h-8 bg-white rounded-full shadow-md
          transition-left duration-300 ease-in-out
          ${isAlunos ? "left-1" : "left-[calc(100%-3.5rem)]"}`}
        style={{ transitionProperty: "left" }}
      ></div>

      <div className="absolute inset-0 flex items-center justify-between px-2 font-montserrat text-sm font-semibold text-white pointer-events-none">
        <span>Alunos</span>
        <span>Cursos</span>
      </div>
    </div>
  );
};
