import { FiSearch } from "react-icons/fi"

export const SearchInput = ({ search, setSearch}) => {

  return (
    <div className="relative w-full">
      <input
        type="search"
        placeholder="Buscar por aluno"
        className="text-gray-medium py-2 pl-3 pr-10 font-medium border border-gray-light rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <FiSearch
        className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-gray text-lg cursor-pointer"
        aria-hidden="true"
      />
    </div>
  )
}
