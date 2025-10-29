import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Students } from '../../pages/Students';
import * as studentService from '../../services/student';

vi.mock('../../services/student', () => ({
  getAllStudents: vi.fn(),
}));

vi.mock('../../components/SearchBar', () => ({
  SearchBar: ({ setSearch, search, type }) => (
    <div data-testid="search-bar">
      <input
        data-testid="search-input"
        type="search"
        placeholder={type === "student" ? "Buscar por aluno" : "Buscar por curso"}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  ),
}));

vi.mock('../../components/StudentList', () => ({
  StudentList: ({ filteredstudents }) => (
    <div data-testid="student-list">
      {filteredstudents.length === 0 ? (
        <p>Nenhum aluno encontrado</p>
      ) : (
        <table>
          <tbody>
            {filteredstudents.map((student) => (
              <tr key={student.id} data-testid={`student-${student.id}`}>
                <td>{student.firstName} {student.lastName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  ),
}));

const mockStudents = [
  { id: 1, firstName: 'João', lastName: 'Silva', createdAt: '2024-01-01' },
  { id: 2, firstName: 'Maria', lastName: 'Santos', createdAt: '2024-01-02' },
  { id: 3, firstName: 'Pedro', lastName: 'Oliveira', createdAt: '2024-01-03' },
];

describe('Students Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar e exibir a lista de alunos', async () => {
    studentService.getAllStudents.mockResolvedValue(mockStudents);

    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('Pedro Oliveira')).toBeInTheDocument();
    });
  });

  it('deve filtrar alunos pelo primeiro nome', async () => {
    studentService.getAllStudents.mockResolvedValue(mockStudents);

    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('student-list')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'João' } });

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument();
    });
  });

  it('deve filtrar alunos pelo sobrenome (case-insensitive)', async () => {
    studentService.getAllStudents.mockResolvedValue(mockStudents);

    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('student-list')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'santos' } });

    await waitFor(() => {
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
    });
  });

  it('deve exibir todos os alunos quando o campo de busca está vazio', async () => {
    studentService.getAllStudents.mockResolvedValue(mockStudents);

    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('Pedro Oliveira')).toBeInTheDocument();
    });
  });

  it('deve tratar erro ao buscar alunos', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    studentService.getAllStudents.mockRejectedValue(new Error('Erro de rede'));

    render(
      <MemoryRouter>
        <Students />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
