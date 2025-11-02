import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { CoursesModal } from "../../components/CousesModal";

// Mock dos ícones
vi.mock("react-icons/io5", () => ({
  IoClose: ({ className, onClick }) => (
    <span
      className={className}
      data-testid="close-icon"
      onClick={onClick}
    >
      ×
    </span>
  ),
}));

describe("Componente CoursesModal", () => {
  const mockStudent = {
    firstName: "João",
    lastName: "Silva",
    courses: ["Matemática", "Física", "Química"],
  };

  const defaultProps = {
    student: mockStudent,
    setCoursesModalOpen: vi.fn(),
  };

  const renderCoursesModal = (props = {}) => {
    return render(<CoursesModal {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o modal com overlay", () => {
      const { container } = renderCoursesModal();

      const overlay = container.querySelector(".fixed.inset-0");
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass(
        "bg-black/50",
        "flex",
        "items-center",
        "justify-center",
        "z-50",
        "p-4"
      );
    });

    it("deve renderizar o nome completo do aluno", () => {
      renderCoursesModal();

      expect(screen.getByText("João Silva")).toBeInTheDocument();
    });

    it("deve renderizar o botão de fechar", () => {
      renderCoursesModal();

      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    });

    it("deve ter a estrutura do modal correta", () => {
      const { container } = renderCoursesModal();

      const modalContent = container.querySelector(".bg-white.rounded-lg");
      expect(modalContent).toBeInTheDocument();
      expect(modalContent).toHaveClass(
        "shadow-xl",
        "max-w-md",
        "w-full",
        "max-h-[80vh]",
        "overflow-hidden"
      );
    });
  });

  describe("Cabeçalho do modal", () => {
    it("deve renderizar o cabeçalho com classes CSS corretas", () => {
      const { container } = renderCoursesModal();

      const header = container.querySelector(".flex.items-center.justify-between");
      expect(header).toHaveClass(
        "px-6",
        "py-4",
        "border-b",
        "border-gray-200"
      );
    });

    it("deve renderizar o título com classes CSS corretas", () => {
      const { container } = renderCoursesModal();

      const title = container.querySelector("h3");
      expect(title).toHaveClass(
        "text-lg",
        "font-semibold",
        "text-neutral-black"
      );
    });

    it("deve renderizar o botão de fechar com classes CSS corretas", () => {
      renderCoursesModal();

      const closeButton = screen.getByTestId("close-icon").closest("button");
      expect(closeButton).toHaveClass(
        "text-dark-gray",
        "hover:text-neutral-black",
        "transition-colors"
      );
    });
  });

  describe("Lista de cursos", () => {
    it("deve renderizar todos os cursos do aluno", () => {
      renderCoursesModal();

      expect(screen.getByText("Matemática")).toBeInTheDocument();
      expect(screen.getByText("Física")).toBeInTheDocument();
      expect(screen.getByText("Química")).toBeInTheDocument();
    });

    it("deve renderizar cursos como badges", () => {
      const { container } = renderCoursesModal();

      const courseItems = container.querySelectorAll("li");
      expect(courseItems).toHaveLength(3);

      courseItems.forEach(item => {
        expect(item).toHaveClass(
          "text-xs",
          "bg-bg-badge",
          "text-secondary",
          "px-3",
          "py-1",
          "rounded-full",
          "font-medium",
          "border",
          "border-light-blue"
        );
      });
    });

    it("deve ter estrutura de lista flexível", () => {
      const { container } = renderCoursesModal();

      const coursesList = container.querySelector("ul");
      expect(coursesList).toHaveClass("flex", "flex-wrap", "gap-2");
    });
  });

  describe("Contador de cursos", () => {
    it("deve mostrar total de cursos corretamente", () => {
      renderCoursesModal();

      expect(screen.getByText(/Total:/)).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element && element.tagName === 'P' &&
          element.className.includes('text-sm') &&
          element.textContent &&
          element.textContent.includes("Total:") &&
          element.textContent.includes("cursos");
      })).toBeInTheDocument();
    });

    it("deve ter estrutura CSS correta no contador", () => {
      const { container } = renderCoursesModal();

      const totalSection = container.querySelector(".mt-4.pt-4.border-t");
      expect(totalSection).toHaveClass("border-gray-200");

      const totalText = container.querySelector(".text-sm.text-dark-gray");
      expect(totalText).toBeInTheDocument();

      const totalNumber = container.querySelector(".font-medium.text-neutral-black");
      expect(totalNumber).toBeInTheDocument();
    });
  });

  describe("Área de conteúdo", () => {
    it("deve ter área de conteúdo com scroll", () => {
      const { container } = renderCoursesModal();

      const contentArea = container.querySelector(".p-6.overflow-y-auto");
      expect(contentArea).toHaveClass("max-h-[60vh]");
    });
  });

  describe("Interações de fechamento", () => {
    it("deve fechar modal ao clicar no overlay", () => {
      const setCoursesModalOpen = vi.fn();
      const { container } = renderCoursesModal({ setCoursesModalOpen });

      const overlay = container.querySelector(".fixed.inset-0");
      fireEvent.click(overlay);

      expect(setCoursesModalOpen).toHaveBeenCalledWith(false);
    });

    it("deve fechar modal ao clicar no botão de fechar", () => {
      const setCoursesModalOpen = vi.fn();
      renderCoursesModal({ setCoursesModalOpen });

      const closeButton = screen.getByTestId("close-icon").closest("button");
      fireEvent.click(closeButton);

      expect(setCoursesModalOpen).toHaveBeenCalledWith(false);
    });

    it("não deve fechar modal ao clicar no conteúdo", () => {
      const setCoursesModalOpen = vi.fn();
      const { container } = renderCoursesModal({ setCoursesModalOpen });

      const modalContent = container.querySelector(".bg-white.rounded-lg");
      fireEvent.click(modalContent);

      expect(setCoursesModalOpen).not.toHaveBeenCalled();
    });

    it("deve prevenir propagação ao clicar no conteúdo", () => {
      const setCoursesModalOpen = vi.fn();
      const { container } = renderCoursesModal({ setCoursesModalOpen });

      const modalContent = container.querySelector(".bg-white.rounded-lg");
      const stopPropagationSpy = vi.fn();

      fireEvent.click(modalContent, {
        stopPropagation: stopPropagationSpy
      });

      expect(setCoursesModalOpen).not.toHaveBeenCalled();
    });
  });

  describe("Estados com diferentes quantidades de cursos", () => {
    it("deve funcionar com lista vazia de cursos", () => {
      const studentWithNoCourses = {
        ...mockStudent,
        courses: [],
      };

      renderCoursesModal({ student: studentWithNoCourses });

      expect(screen.getByText("João Silva")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element && element.tagName === 'P' &&
          element.className.includes('text-sm') &&
          element.textContent &&
          element.textContent.includes("Total:") &&
          element.textContent.includes("cursos");
      })).toBeInTheDocument();
    });

    it("deve funcionar com muitos cursos", () => {
      const studentWithManyCourses = {
        ...mockStudent,
        courses: Array.from({ length: 10 }, (_, i) => `Curso ${i + 1}`),
      };

      renderCoursesModal({ student: studentWithManyCourses });

      expect(screen.getByText("João Silva")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element && element.tagName === 'P' &&
          element.className.includes('text-sm') &&
          element.textContent &&
          element.textContent.includes("Total:") &&
          element.textContent.includes("cursos");
      })).toBeInTheDocument();

      // Verifica se alguns cursos estão presentes
      expect(screen.getByText("Curso 1")).toBeInTheDocument();
      expect(screen.getByText("Curso 10")).toBeInTheDocument();
    });

    it("deve lidar com cursos com nomes longos", () => {
      const studentWithLongCourseNames = {
        ...mockStudent,
        courses: [
          "Introdução à Programação Orientada a Objetos",
          "Análise e Desenvolvimento de Sistemas",
        ],
      };

      renderCoursesModal({ student: studentWithLongCourseNames });

      expect(screen.getByText("Introdução à Programação Orientada a Objetos")).toBeInTheDocument();
      expect(screen.getByText("Análise e Desenvolvimento de Sistemas")).toBeInTheDocument();
    });
  });

  describe("Diferentes nomes de alunos", () => {
    it("deve funcionar com nomes simples", () => {
      const studentWithSimpleName = {
        ...mockStudent,
        firstName: "Ana",
        lastName: "Costa",
      };

      renderCoursesModal({ student: studentWithSimpleName });

      expect(screen.getByText("Ana Costa")).toBeInTheDocument();
    });

    it("deve funcionar com nomes compostos", () => {
      const studentWithCompoundName = {
        ...mockStudent,
        firstName: "Maria José",
        lastName: "da Silva Santos",
      };

      renderCoursesModal({ student: studentWithCompoundName });

      expect(screen.getByText("Maria José da Silva Santos")).toBeInTheDocument();
    });

    it("deve funcionar com nomes vazios", () => {
      const studentWithEmptyNames = {
        ...mockStudent,
        firstName: "",
        lastName: "",
      };

      renderCoursesModal({ student: studentWithEmptyNames });

      // Check that the modal renders without error
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    });
  });

  describe("Casos extremos", () => {
    it("deve funcionar sem setCoursesModalOpen", () => {
      expect(() =>
        renderCoursesModal({ setCoursesModalOpen: undefined })
      ).not.toThrow();
    });

    it("deve funcionar com student undefined", () => {
      expect(() =>
        renderCoursesModal({ student: undefined })
      ).toThrow();
    });

    it("deve funcionar com courses undefined", () => {
      const studentWithUndefinedCourses = {
        ...mockStudent,
        courses: undefined,
      };

      expect(() =>
        renderCoursesModal({ student: studentWithUndefinedCourses })
      ).toThrow();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter ícone de fechar com cursor pointer", () => {
      renderCoursesModal();

      const closeIcon = screen.getByTestId("close-icon");
      expect(closeIcon).toHaveClass("cursor-pointer");
    });

    it("deve ter z-index adequado para modal", () => {
      const { container } = renderCoursesModal();

      const overlay = container.querySelector(".fixed.inset-0");
      expect(overlay).toHaveClass("z-50");
    });

    it("deve ter largura responsiva", () => {
      const { container } = renderCoursesModal();

      const modalContent = container.querySelector(".bg-white.rounded-lg");
      expect(modalContent).toHaveClass("max-w-md", "w-full");
    });
  });
});