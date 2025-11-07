import { Link, useLocation } from "react-router-dom";
import { usePage } from "../contexts/PageContext";
import { useState, useEffect } from "react";
import { ConfirmationModal } from "./ConfirmationModal";
import logo from "../assets/img/Logo.png";
import trash from "../assets/img/Trash.png";
import { IoIosArrowBack } from "react-icons/io";
import { HeaderToggle } from "./HeaderToggle";

/**
 * Componente de cabeçalho reutilizável.
 * 
 * Este componente exibe o cabeçalho com o logotipo e o cabeçalho de navegação.
 * 
 * A logo é substituída por um botão de voltar quando o usuário não está na página raiz ("/alunos" ou "/cursos").
 * 
 * Também exibe um botão de exclusão quando a página atual possui uma função `onDelete` definida no contexto da página.
 * 
 * Ao clicar no botão de exclusão, um modal de confirmação é exibido, utilizando o componente `ConfirmationModal`.
 */

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { pageData, setPageData } = usePage();

  const isRoot = location.pathname === "/alunos" || location.pathname === "/cursos";
  const isUpdateStudent = location.pathname.startsWith("/edicao-aluno/");
  const isUpdateCourse = location.pathname.startsWith("/edicao-curso/");
  const isUpdate = isUpdateStudent || isUpdateCourse;

  const handleDelete = async () => {
    if (pageData.onDelete) await pageData.onDelete();
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (location.pathname === "/alunos") {
      setPageData({ title: "Gerenciador de alunos", onDelete: null });
    } else if (location.pathname === "/cursos") {
      setPageData({ title: "Gerenciador de cursos", onDelete: null });
    }
  }, [location.pathname, setPageData]);

  return (
    <header className="bg-primary h-[67px]">
      <div className="p-4 sm:px-[42px] flex justify-between items-center">
        <div className="flex items-center gap-[25px]">
          {!isRoot && (
            <Link to="/" aria-label="voltar">
              <IoIosArrowBack className="text-white text-2xl" />
            </Link>
          )}
          {!isUpdate && (
            <Link to={isRoot ? location.pathname : "/"}>
              <div className="w-7 sm:w-[38px]">
                <img className="w-full" src={logo} alt="Logo" />
              </div>
            </Link>
          )}
          <h1 className="text-white font-bold sm:font-extrabold tracking-[1%] leading-[30px] flex items-center gap-1 sm:gap-2 text-sm sm:text-base -ml-2.5 sm:ml-0 sm:-mr-2">
            {pageData.title}
          </h1>
          {isUpdate && pageData.subtitle && (
            <div className="hidden sm:flex items-center gap-4 text-white font-medium text-sm">
              <span>|</span>
              <span>{pageData.subtitle}</span>
            </div>
          )}
        </div>

        {isRoot ? (
          <HeaderToggle />
        ) : (
          pageData.onDelete && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer w-4 h-4 sm:w-5 sm:h-5"
              title="Excluir"
            >
              <img className="w-full" src={trash} alt="Trash icon" />
            </button>
          )
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </header>
  );
};
