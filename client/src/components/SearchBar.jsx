import { AddButton } from "./AddButton"
import { SearchInput } from "./SearchInput"

export const SearchBar = ({ students, setSearch, search }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
      <SearchInput students={students} setSearch={setSearch} search={search} />
      <AddButton />
    </div>
  )
}
