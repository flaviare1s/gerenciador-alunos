import { useLocation, useNavigate } from "react-router-dom";

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
    <div
      onClick={togglePage}
      className="relative w-32 h-10 cursor-pointer select-none"
    >
      <div className="absolute inset-0 bg-primary rounded-full"></div>

      <div
        className={`absolute top-1 w-14 h-8 bg-white rounded-full shadow-md transition-all duration-300
          ${isAlunos ? "left-1" : "left-[calc(100%-3.5rem)]"}`}
      ></div>

      <div className="absolute inset-0 flex items-center justify-between px-2 font-montserrat text-sm font-semibold text-white pointer-events-none">
        <span>Alunos</span>
        <span>Cursos</span>
      </div>
    </div>
  );
};
