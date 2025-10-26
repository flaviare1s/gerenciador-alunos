import { Link, useLocation } from "react-router-dom";
import logo from "../assets/img/Logo.png";
import trash from "../assets/img/Trash.png";
import { IoIosArrowBack } from "react-icons/io";

export const Header = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";

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
          <h1 className="text-white font-extrabold tracking-[1%] leading-[30px]">
            Gerenciador de alunos
          </h1>
        </div>
        {!isRoot && (
          <button className="cursor-pointer w-[17.5px] h-[17.5px]">
            <img className="w-full" src={trash} alt="Trash" />
          </button>
        )}
      </div>
    </header>
  );
};
