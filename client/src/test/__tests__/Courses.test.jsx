import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Courses } from '../../pages/Courses';
import * as courseService from '../../services/course';

vi.mock('../../services/course', () => ({
  getAllCourses: vi.fn(),
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

vi.mock('../../components/CourseList', () => ({
  CourseList: ({ filteredItems }) => (
    <div data-testid="course-list">
      {filteredItems.length === 0 ? (
        <p>Nenhum curso encontrado</p>
      ) : (
        <table>
          <tbody>
            {filteredItems.map((course) => (
              <tr key={course.id} data-testid={`course-${course.id}`}>
                <td>{course.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  ),
}));

const mockCourses = [
  { id: 1, name: 'JavaScript Avançado' },
  { id: 2, name: 'React Básico' },
  { id: 3, name: 'Node.js Completo' },
];

describe('Courses Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar e exibir a lista de cursos', async () => {
    courseService.getAllCourses.mockResolvedValue(mockCourses);

    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('JavaScript Avançado')).toBeInTheDocument();
      expect(screen.getByText('React Básico')).toBeInTheDocument();
      expect(screen.getByText('Node.js Completo')).toBeInTheDocument();
    });
  });

  it('deve filtrar cursos pelo nome (case-insensitive)', async () => {
    courseService.getAllCourses.mockResolvedValue(mockCourses);

    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('course-list')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'react' } });

    await waitFor(() => {
      expect(screen.getByText('React Básico')).toBeInTheDocument();
      expect(screen.queryByText('JavaScript Avançado')).not.toBeInTheDocument();
    });
  });

  it('deve exibir todos os cursos quando o campo de busca está vazio', async () => {
    courseService.getAllCourses.mockResolvedValue(mockCourses);

    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('JavaScript Avançado')).toBeInTheDocument();
      expect(screen.getByText('React Básico')).toBeInTheDocument();
      expect(screen.getByText('Node.js Completo')).toBeInTheDocument();
    });
  });

  it('deve renderizar SearchBar com placeholder de curso', async () => {
    courseService.getAllCourses.mockResolvedValue(mockCourses);

    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Buscar por curso');
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('deve chamar getAllCourses ao montar o componente', async () => {
    courseService.getAllCourses.mockResolvedValue(mockCourses);

    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(courseService.getAllCourses).toHaveBeenCalledTimes(1);
    });
  });

  it('deve tratar erro ao buscar cursos', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    courseService.getAllCourses.mockRejectedValue(new Error('Erro de rede'));

    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Erro ao buscar cursos:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('deve filtrar parcialmente pelo nome', async () => {
    courseService.getAllCourses.mockResolvedValue(mockCourses);

    render(
      <MemoryRouter>
        <Courses />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('course-list')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'java' } });

    await waitFor(() => {
      expect(screen.getByText('JavaScript Avançado')).toBeInTheDocument();
      expect(screen.queryByText('React Básico')).not.toBeInTheDocument();
    });
  });
});
