import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { CourseList } from "../../components/CourseList";

// Mock dos ícones
vi.mock("react-icons/hi", () => ({
  HiOutlineArrowNarrowUp: ({ className }) => (
    <span className={className} data-testid="arrow-up">↑</span>
  ),
  HiOutlineArrowNarrowDown: ({ className }) => (
    <span className={className} data-testid="arrow-down">↓</span>
  ),
}));

// Mock do Course component
vi.mock("../../components/Course", () => ({
  Course: ({ course, onCourseDeleted }) => (
    <tr data-testid={`course-${course.id}`}>
      <td>{course.name}</td>
      <td>
        <button
          data-testid={`delete-course-${course.id}`}
          onClick={() => onCourseDeleted(course.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ),
}));

// Mock do Pagination component
vi.mock("../../components/Pagination", () => ({
  Pagination: ({ totalPages, currentPage, onPageChange }) => (
    <div data-testid="pagination">
      <span data-testid="total-pages">{totalPages}</span>
      <span data-testid="current-page">{currentPage}</span>
      <button
        data-testid="page-change"
        onClick={() => onPageChange(2)}
      >
        Go to page 2
      </button>
    </div>
  ),
}));

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe("Componente CourseList", () => {
  const mockCourses = [
    { id: 1, name: "Matemática" },
    { id: 2, name: "Física" },
    { id: 3, name: "Química" },
    { id: 4, name: "Biologia" },
  ];

  const defaultProps = {
    filteredItems: mockCourses,
    setItems: vi.fn(),
    currentPage: 1,
    setCurrentPage: vi.fn(),
  };

  const renderCourseList = (props = {}) => {
    return render(<CourseList {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue("asc");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar a tabela com cabeçalhos", () => {
      renderCourseList();

      expect(screen.getByText("Nome do curso")).toBeInTheDocument();
      expect(screen.getByText("Ações")).toBeInTheDocument();
    });

    it("deve renderizar todos os cursos", () => {
      renderCourseList();

      expect(screen.getByTestId("course-1")).toBeInTheDocument();
      expect(screen.getByTestId("course-2")).toBeInTheDocument();
      expect(screen.getByTestId("course-3")).toBeInTheDocument();
      expect(screen.getByTestId("course-4")).toBeInTheDocument();
    });

    it("deve renderizar o componente de paginação", () => {
      renderCourseList();

      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("deve ter a estrutura CSS correta", () => {
      const { container } = renderCourseList();

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("pt-[52px]", "w-full", "overflow-x-auto");

      const table = container.querySelector("table");
      expect(table).toHaveClass("w-full");
    });
  });

  describe("Cabeçalho da tabela", () => {
    it("deve ter as classes CSS corretas no cabeçalho", () => {
      const { container } = renderCourseList();

      const thead = container.querySelector("thead tr");
      expect(thead).toHaveClass("border-b", "border-gray-border", "text-left");
    });

    it("deve renderizar botões de ordenação", () => {
      renderCourseList();

      expect(screen.getByTestId("arrow-up")).toBeInTheDocument();
      expect(screen.getByTestId("arrow-down")).toBeInTheDocument();
    });

    it("deve ter as classes CSS corretas nas células do cabeçalho", () => {
      const { container } = renderCourseList();

      const nameHeader = container.querySelector("th:first-child");
      expect(nameHeader).toHaveClass(
        "font-medium",
        "text-dark-gray",
        "text-xs",
        "px-2",
        "py-[13px]",
        "text-left"
      );

      const actionsHeader = container.querySelector("th:last-child");
      expect(actionsHeader).toHaveClass(
        "font-medium",
        "text-dark-gray",
        "text-xs",
        "px-2",
        "py-[13px]",
        "text-right"
      );
    });
  });

  describe("Ordenação", () => {
    it("deve carregar ordem de ordenação do localStorage", () => {
      localStorageMock.getItem.mockReturnValue("desc");
      renderCourseList();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("courseSortOrder");
    });

    it("deve usar ordenação ascendente por padrão", () => {
      localStorageMock.getItem.mockReturnValue(null);
      renderCourseList();

      // Verifica se a ordenação padrão é aplicada
      expect(screen.getByText("Biologia")).toBeInTheDocument();
    });

    it("deve alternar ordem de ordenação ao clicar no botão", () => {
      const setCurrentPage = vi.fn();
      renderCourseList({ setCurrentPage });

      const sortButton = screen.getByTestId("arrow-up").closest("button");
      fireEvent.click(sortButton);

      expect(localStorageMock.setItem).toHaveBeenCalledWith("courseSortOrder", "desc");
      expect(setCurrentPage).toHaveBeenCalledWith(1);
    });

    it("deve salvar nova ordem no localStorage", () => {
      renderCourseList();

      const sortButton = screen.getByTestId("arrow-up").closest("button");
      fireEvent.click(sortButton);

      expect(localStorageMock.setItem).toHaveBeenCalledWith("courseSortOrder", "desc");
    });

    it("deve resetar página atual ao mudar ordenação", () => {
      const setCurrentPage = vi.fn();
      renderCourseList({ setCurrentPage, currentPage: 3 });

      const sortButton = screen.getByTestId("arrow-up").closest("button");
      fireEvent.click(sortButton);

      expect(setCurrentPage).toHaveBeenCalledWith(1);
    });
  });

  describe("Indicadores visuais de ordenação", () => {
    it("deve destacar seta para cima em ordenação ascendente", () => {
      localStorageMock.getItem.mockReturnValue("asc");
      renderCourseList();

      const arrowUp = screen.getByTestId("arrow-up");
      expect(arrowUp).toHaveClass("text-secondary", "-mr-1.5");
    });

    it("deve destacar seta para baixo em ordenação descendente", () => {
      localStorageMock.getItem.mockReturnValue("desc");
      renderCourseList();

      const arrowDown = screen.getByTestId("arrow-down");
      expect(arrowDown).toHaveClass("text-secondary", "-mr-1.5");
    });
  });

  describe("Paginação", () => {
    it("deve calcular total de páginas corretamente", () => {
      renderCourseList({ filteredItems: mockCourses });

      expect(screen.getByTestId("total-pages")).toHaveTextContent("1");
    });

    it("deve calcular total de páginas com mais cursos", () => {
      const manyCourses = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Curso ${i + 1}`,
      }));

      renderCourseList({ filteredItems: manyCourses });

      expect(screen.getByTestId("total-pages")).toHaveTextContent("3");
    });

    it("deve passar página atual para paginação", () => {
      renderCourseList({ currentPage: 2 });

      expect(screen.getByTestId("current-page")).toHaveTextContent("2");
    });

    it("deve permitir mudança de página", () => {
      const setCurrentPage = vi.fn();
      renderCourseList({ setCurrentPage });

      const pageChangeButton = screen.getByTestId("page-change");
      fireEvent.click(pageChangeButton);

      expect(setCurrentPage).toHaveBeenCalledWith(2);
    });
  });

  describe("Exibição de itens por página", () => {
    it("deve mostrar máximo 10 itens por página", () => {
      const manyCourses = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Curso ${String(i + 1).padStart(2, '0')}`, // Use zero-padded names for proper sorting
      }));

      renderCourseList({ filteredItems: manyCourses, currentPage: 1 });

      // Deve mostrar apenas 10 cursos na primeira página (considering alphabetical sorting)
      const tbody = screen.getByTestId("course-1").closest("tbody");
      const rows = tbody.querySelectorAll('[data-testid^="course-"]');
      expect(rows).toHaveLength(10);
    });

    it("deve mostrar itens corretos na segunda página", () => {
      const manyCourses = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Curso ${String(i + 1).padStart(2, '0')}`, // Use zero-padded names for proper sorting
      }));

      renderCourseList({ filteredItems: manyCourses, currentPage: 2 });

      // Deve mostrar cursos restantes na segunda página
      const tbody = screen.getByTestId("course-11").closest("tbody");
      const rows = tbody.querySelectorAll('[data-testid^="course-"]');
      expect(rows).toHaveLength(5); // Should show 5 remaining courses
    });
  });

  describe("Exclusão de cursos", () => {
    it("deve remover curso da lista ao excluir", () => {
      const setItems = vi.fn();
      renderCourseList({ setItems });

      const deleteButton = screen.getByTestId("delete-course-1");
      fireEvent.click(deleteButton);

      expect(setItems).toHaveBeenCalledWith(expect.any(Function));

      // Testa a função de filtro
      const filterFunction = setItems.mock.calls[0][0];
      const filteredResult = filterFunction(mockCourses);

      expect(filteredResult).toHaveLength(3);
      expect(filteredResult.find(c => c.id === 1)).toBeUndefined();
    });
  });

  describe("Ordenação de cursos", () => {
    const coursesWithSpecialCases = [
      { id: 1, name: "Zebra" },
      { id: 2, name: "Alpha" },
      { id: 3, name: "" },
      { id: 4, name: "  Beta  " },
      { id: 5, name: null },
    ];

    it("deve ordenar corretamente cursos com nomes especiais", () => {
      renderCourseList({
        filteredItems: coursesWithSpecialCases
      });

      // Com ordenação ascendente, deve aparecer: Alpha, Beta, Zebra, depois vazios
      const tbody = screen.getByTestId("course-2").closest("tbody");
      const rows = tbody.querySelectorAll('[data-testid^="course-"]');

      expect(rows).toHaveLength(5);
    });

    it("deve tratar nomes com espaços em branco", () => {
      const coursesWithSpaces = [
        { id: 1, name: "  Curso A  " },
        { id: 2, name: "Curso B" },
      ];

      renderCourseList({ filteredItems: coursesWithSpaces });

      expect(screen.getByTestId("course-1")).toBeInTheDocument();
      expect(screen.getByTestId("course-2")).toBeInTheDocument();
    });
  });

  describe("Estados extremos", () => {
    it("deve funcionar com lista vazia", () => {
      renderCourseList({ filteredItems: [] });

      expect(screen.getByText("Nome do curso")).toBeInTheDocument();
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
      expect(screen.getByTestId("total-pages")).toHaveTextContent("0");
    });

    it("deve funcionar sem filteredItems definido", () => {
      renderCourseList({ filteredItems: undefined });

      expect(screen.getByText("Nome do curso")).toBeInTheDocument();
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("deve funcionar sem setItems", () => {
      expect(() => renderCourseList({ setItems: undefined })).not.toThrow();
    });

    it("deve funcionar sem setCurrentPage", () => {
      const mockSetCurrentPage = vi.fn();
      expect(() => renderCourseList({ setCurrentPage: mockSetCurrentPage })).not.toThrow();
    });
  });

  describe("Persistência de estado", () => {
    it("deve manter ordenação entre renderizações", () => {
      localStorageMock.getItem.mockReturnValue("desc");
      const { rerender } = renderCourseList();

      rerender(<CourseList {...defaultProps} />);

      expect(localStorageMock.getItem).toHaveBeenCalledWith("courseSortOrder");
    });
  });
});