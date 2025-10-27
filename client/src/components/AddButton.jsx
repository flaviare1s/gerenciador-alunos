import { Link } from "react-router-dom"
import addIcon from "../assets/img/Add.png"
export const AddButton = () => {
  return (
    <Link
      to="/cadastro-aluno"
      className="flex items-center justify-center gap-2 py-2 px-6 text-neutral-black text-sm border border-gray-medium rounded-md cursor-pointer hover:bg-gray-light hover:text-primary w-full sm:w-auto"
    >
      <span className="w-6 h-6">
        <img className="w-full mt-1" src={addIcon} alt="" aria-hidden="true" />
      </span>
      <span>Adicionar</span>
    </Link>
  )
}
