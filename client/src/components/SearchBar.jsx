import { AddButton } from "./AddButton"
import { SearchInput } from "./SearchInput"

export const SearchBar = () => {
  return (
    <div className="flex justify-between items-center gap-5">
      <SearchInput />
      <AddButton />
    </div>
  )
}
