import { Link, useLocation } from "react-router-dom";
import { usePage } from "../contexts/PageContext";
import { useState, useEffect } from "react";
import { ConfirmationModal } from "./ConfirmationModal";
import logo from "../assets/img/Logo.png";
import trash from "../assets/img/Trash.png";
import { IoIosArrowBack } from "react-icons/io";
import { HeaderToggle } from "./HeaderToggle";

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { pageData, setPageData } = usePage();

  const isRoot = location.pathname === "/alunos" || location.pathname === "/cursos";

  const handleDelete = async () => {
    if (pageData.onDelete) await pageData.onDelete();
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (location.pathname === "/alunos") {
      setPageData({ title: "Alunos", onDelete: null });
    } else if (location.pathname === "/cursos") {
      setPageData({ title: "Cursos", onDelete: null });
    }
  }, [location.pathname, setPageData]);

  return (
    <header className="bg-primary">
      <div className="py-[18px] px-[42px] flex justify-between items-center">
        <div className="flex items-center gap-[25px]">
          {!isRoot && (
            <Link to="/">
              <IoIosArrowBack className="text-white text-2xl" />
            </Link>
          )}
          <Link to={isRoot ? location.pathname : "/"}>
            <img src={logo} alt="Logo" />
          </Link>
          <h1 className="text-white font-extrabold tracking-[1%] leading-[30px] flex items-center gap-2">
            {pageData.title}
          </h1>
        </div>

        {isRoot ? (
          <HeaderToggle />
        ) : (
          pageData.onDelete && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer w-5 h-5"
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
