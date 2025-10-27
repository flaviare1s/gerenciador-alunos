import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/img/Logo.png";
import trash from "../assets/img/Trash.png";
import { IoIosArrowBack } from "react-icons/io";
import { usePage } from "../contexts/PageContext";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRoot = location.pathname === "/";
  const { pageData } = usePage();

  const handleDelete = async () => {
    if (pageData.onDelete && confirm("Deseja realmente excluir este item?")) {
      await pageData.onDelete();
      navigate("/");
    }
  };

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
            onClick={handleDelete}
            className="cursor-pointer w-5 h-5"
            title="Excluir"
          >
            <img className="w-full" src={trash} alt="Trash icon" />
          </button>
        )}
      </div>
    </header>
  );
};
