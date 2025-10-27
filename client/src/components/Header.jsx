import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/img/Logo.png";
import trash from "../assets/img/Trash.png";
import { IoIosArrowBack } from "react-icons/io";
import { usePage } from "../contexts/PageContext";
import { useState } from "react";
import { ConfirmationModal } from "./ConfirmationModal";
import { useEffect } from "react";

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isRoot = location.pathname === "/";
  const { pageData, setPageData } = usePage();

  const handleDelete = async () => {
    if (pageData.onDelete) {
      await pageData.onDelete();
      navigate("/");
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setPageData({
        title: "Gerenciador de alunos",
        subtitle: "",
        onDelete: null,
      });
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
          {isRoot && (
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          )}
          <h1 className="text-white font-extrabold tracking-[1%] leading-[30px] flex items-center gap-2">
            {pageData.title}
            {pageData.subtitle && (
              <span className="font-medium text-white text-sm">
                | {pageData.subtitle}
              </span>
            )}
          </h1>
        </div>

        {!isRoot && pageData.onDelete && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer w-5 h-5"
            title="Excluir"
          >
            <img className="w-full" src={trash} alt="Trash icon" />
          </button>
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
