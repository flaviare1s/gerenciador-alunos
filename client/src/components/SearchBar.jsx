import { AddButton } from "./AddButton"
import { SearchInput } from "./SearchInput"

export const SearchBar = ({ alunos, setSearch, search }) => {
  return (
    <div className="flex justify-between items-center gap-5">
      <SearchInput alunos={alunos} setSearch={setSearch} search={search} />
      <AddButton />
    </div>
  )
}
