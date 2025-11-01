import { useEffect } from "react";
import { FiSearch } from "react-icons/fi"

/**
 * Componente reutilizável de campo de busca.
 * 
 * Este componente exibe um campo de busca com um icone de lupa e o placeholder que varia conforme o tipo de busca (aluno ou curso).
 * O resultado da busca é salvo no localStorage para persistência entre sessões.
 */

export const SearchInput = ({ search, setSearch, placeholder }) => {
  useEffect(() => {
    const savedSearch = localStorage.getItem("searchTerm");
    if (savedSearch) {
      setSearch(savedSearch);
    }
  }, [setSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    localStorage.setItem("searchTerm", value);
  };


  return (
    <div className="relative w-full">
      <input
        type="search"
        placeholder={placeholder}
        className="text-gray-medium py-2 pl-3 pr-10 font-medium border border-gray-light rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
        value={search}
        onChange={handleSearchChange}
        data-testid="search-input"
      />
      <FiSearch
        className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-gray text-lg cursor-pointer"
        aria-hidden="true"
      />
    </div>
  )
}
