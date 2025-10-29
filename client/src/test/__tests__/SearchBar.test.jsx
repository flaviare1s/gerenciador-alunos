import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { SearchBar } from '../../components/SearchBar';
import addIcon from '../../assets/img/Add.png';

vi.mock('../components/SearchInput', () => ({
  SearchInput: ({ placeholder, search, setSearch }) => (
    <input
      data-testid="search-input"
      type="search"
      placeholder={placeholder}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  ),
}));

vi.mock('../components/AddButton', () => ({
  AddButton: ({ type }) => (
    <button data-testid="add-button">
      <span className="w-6 h-6 flex items-center justify-center">
              {type === "student" ? (
                <img className="w-full mt-1" src={addIcon} alt="" aria-hidden="true" />
              ) : (
                <MdOutlineLibraryAdd className="text-primary text-2xl" />
              )}
            </span>
            <span>Adicionar</span>
    </button>
  ),
}));

describe('SearchBar Component', () => {
  it('deve renderizar com placeholder de aluno por padrão', () => {
    render(
      <MemoryRouter>
        <SearchBar setSearch={vi.fn()} search="" />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Buscar por aluno')).toBeInTheDocument();
  });

  it('deve renderizar com placeholder de curso quando type="course"', () => {
    render(
      <MemoryRouter>
        <SearchBar setSearch={vi.fn()} search="" type="course" />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Buscar por curso')).toBeInTheDocument();
  });

  it('deve renderizar SearchInput e AddButton', () => {
    render(
      <MemoryRouter>
        <SearchBar setSearch={vi.fn()} search="" />
      </MemoryRouter>
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
  });

  it('deve passar o tipo correto para AddButton', () => {
    render(
      <MemoryRouter>
        <SearchBar setSearch={vi.fn()} search="" type="course" />
      </MemoryRouter>
    );

    expect(screen.getByText('Adicionar')).toBeInTheDocument();
  });
});
