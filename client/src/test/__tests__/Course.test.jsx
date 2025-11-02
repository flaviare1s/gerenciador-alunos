import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Course } from "../../components/Course";
import toast from "react-hot-toast";
import { deleteCourse } from "../../services/course";

// Mock do react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ to, children, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

// Mock dos ícones
vi.mock("react-icons/fa", () => ({
  FaRegEdit: ({ className }) => (
    <span className={className} data-testid="edit-icon">✏️</span>
  ),
}));

vi.mock("react-icons/fi", () => ({
  FiTrash2: ({ className }) => (
    <span className={className} data-testid="delete-icon">🗑️</span>
  ),
}));

// Mock do toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock do service
vi.mock("../../services/course", () => ({
  deleteCourse: vi.fn(),
}));

// Mock do ReactDOM
vi.mock("react-dom", () => ({
  default: {
    createPortal: vi.fn((children) => children),
  },
  createPortal: vi.fn((children) => children),
}));

// Mock do ConfirmationModal
vi.mock("../../components/ConfirmationModal", () => ({
  ConfirmationModal: ({ isOpen, onClose, onConfirm }) =>
    isOpen ? (
      <div data-testid="confirmation-modal">
        <button data-testid="modal-close" onClick={onClose}>
          Cancelar
        </button>
        <button data-testid="modal-confirm" onClick={onConfirm}>
          Confirmar
        </button>
      </div>
    ) : null,
}));

describe("Componente Course", () => {
  const mockDeleteCourse = vi.mocked(deleteCourse);

  const mockCourse = {
    id: 1,
    name: "Matemática",
  };

  const defaultProps = {
    course: mockCourse,
    onCourseDeleted: vi.fn(),
  };

  const renderCourse = (props = {}) => {
    return render(
      <BrowserRouter>
        <table>
          <tbody>
            <Course {...defaultProps} {...props} />
          </tbody>
        </table>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o nome do curso", () => {
      renderCourse();

      expect(screen.getByText("Matemática")).toBeInTheDocument();
    });

    it("deve renderizar o botão de editar", () => {
      renderCourse();

      const editButton = screen.getByTestId("edit-icon").closest("a");
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveAttribute("href", "/edicao-curso/1");
    });

    it("deve renderizar o botão de excluir", () => {
      renderCourse();

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      expect(deleteButton).toBeInTheDocument();
    });

    it("deve ter a estrutura de linha da tabela correta", () => {
      const { container } = renderCourse();

      const row = container.querySelector("tr");
      expect(row).toHaveClass(
        "hover:bg-gray-100",
        "border-b",
        "border-gray-border"
      );
    });
  });

  describe("Estrutura CSS", () => {
    it("deve ter as classes CSS corretas na célula do nome", () => {
      const { container } = renderCourse();

      const nameCell = container.querySelector("td:first-child");
      expect(nameCell).toHaveClass(
        "px-2",
        "py-[30px]",
        "text-sm",
        "text-neutral-black",
        "font-medium"
      );
    });

    it("deve ter as classes CSS corretas na célula de ações", () => {
      const { container } = renderCourse();

      const actionsCell = container.querySelector("td:last-child");
      expect(actionsCell).toHaveClass("px-2", "py-[30px]", "text-right");
    });

    it("deve ter classes CSS corretas no link de edição", () => {
      renderCourse();

      const editLink = screen.getByTestId("edit-icon").closest("a");
      expect(editLink).toHaveClass(
        "text-sm",
        "text-secondary",
        "font-medium",
        "hover:text-secondary/80",
        "mr-4"
      );
    });

    it("deve ter classes CSS corretas no botão de exclusão", () => {
      renderCourse();

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      expect(deleteButton).toHaveClass(
        "text-sm",
        "text-primary",
        "font-medium",
        "hover:text-primary/80",
        "cursor-pointer"
      );
    });
  });

  describe("Navegação", () => {
    it("deve ter link correto para edição", () => {
      renderCourse({ course: { ...mockCourse, id: 5 } });

      const editLink = screen.getByTestId("edit-icon").closest("a");
      expect(editLink).toHaveAttribute("href", "/edicao-curso/5");
    });

    it("deve renderizar ícones corretamente", () => {
      renderCourse();

      expect(screen.getByTestId("edit-icon")).toBeInTheDocument();
      expect(screen.getByTestId("delete-icon")).toBeInTheDocument();
    });
  });

  describe("Modal de confirmação", () => {
    it("deve abrir modal ao clicar em excluir", () => {
      renderCourse();

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      fireEvent.click(deleteButton);

      expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    });

    it("deve fechar modal ao clicar em cancelar", () => {
      renderCourse();

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      fireEvent.click(deleteButton);

      const closeButton = screen.getByTestId("modal-close");
      fireEvent.click(closeButton);

      expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
    });

    it("não deve mostrar modal inicialmente", () => {
      renderCourse();

      expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
    });
  });

  describe("Exclusão de curso", () => {
    it("deve chamar deleteCourse ao confirmar exclusão", async () => {
      mockDeleteCourse.mockResolvedValue();
      renderCourse();

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByTestId("modal-confirm");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockDeleteCourse).toHaveBeenCalledWith(1);
      });
    });

    it("deve mostrar toast de sucesso ao excluir", async () => {
      mockDeleteCourse.mockResolvedValue();
      renderCourse();

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByTestId("modal-confirm");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Curso deletado com sucesso!");
      });
    });

    it("deve chamar onCourseDeleted após exclusão bem-sucedida", async () => {
      mockDeleteCourse.mockResolvedValue();
      const onCourseDeleted = vi.fn();
      renderCourse({ onCourseDeleted });

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByTestId("modal-confirm");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(onCourseDeleted).toHaveBeenCalledWith(1);
      });
    });

    it("deve fechar modal após exclusão bem-sucedida", async () => {
      mockDeleteCourse.mockResolvedValue();
      renderCourse();

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByTestId("modal-confirm");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
      });
    });
  });

  describe("Tratamento de erros", () => {
    it("deve mostrar toast de erro ao falhar na exclusão", async () => {
      mockDeleteCourse.mockRejectedValue(new Error("Erro de rede"));
      renderCourse();

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByTestId("modal-confirm");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao deletar curso.");
      });
    });

    it("deve fechar modal mesmo quando falha na exclusão", async () => {
      mockDeleteCourse.mockRejectedValue(new Error("Erro de rede"));
      renderCourse();

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByTestId("modal-confirm");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
      });
    });

    it("não deve chamar onCourseDeleted quando falha na exclusão", async () => {
      mockDeleteCourse.mockRejectedValue(new Error("Erro de rede"));
      const onCourseDeleted = vi.fn();
      renderCourse({ onCourseDeleted });

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByTestId("modal-confirm");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });

      expect(onCourseDeleted).not.toHaveBeenCalled();
    });
  });

  describe("Casos extremos", () => {
    it("deve funcionar sem onCourseDeleted", async () => {
      mockDeleteCourse.mockResolvedValue();
      renderCourse({ onCourseDeleted: undefined });

      const deleteButton = screen.getByTestId("delete-icon").closest("button");
      fireEvent.click(deleteButton);

      const confirmButton = screen.getByTestId("modal-confirm");

      expect(() => fireEvent.click(confirmButton)).not.toThrow();
    });

    it("deve funcionar com ID de curso diferente", () => {
      renderCourse({ course: { id: 999, name: "Teste" } });

      const editLink = screen.getByTestId("edit-icon").closest("a");
      expect(editLink).toHaveAttribute("href", "/edicao-curso/999");
    });
  });
});