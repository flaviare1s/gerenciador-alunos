import { AddButton } from "./AddButton";
import { SearchInput } from "./SearchInput";

/**
 * Componente reutilizável de barra de busca.
 * 
 * Este componente exibe um campo de busca e um botão de adicionar, sendo reutilizado nas páginas de alunos ou cursos.
 */

export const SearchBar = ({ setSearch, search, type = "student" }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
      <SearchInput
        search={search}
        setSearch={setSearch}
        placeholder={type === "student" ? "Buscar por aluno" : "Buscar por curso"}
      />
      <AddButton type={type} />
    </div>
  );
};
