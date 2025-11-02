import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { Enrollment } from "../../components/Enrollment";

// Mock do ícone do react-icons
vi.mock("react-icons/lia", () => ({
  LiaPlusCircleSolid: ({ className }) => <span className={className} data-testid="plus-icon">+</span>,
}));

describe("Componente Enrollment", () => {
  const mockCourses = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Physics" },
    { id: 3, name: "Chemistry" },
  ];

  const defaultProps = {
    courses: mockCourses,
    allCourses: [],
    setSelectedCourse: vi.fn(),
    setCompletionDate: vi.fn(),
    submitting: false,
    selectedCourse: "",
    completionDate: "",
    handleAddCourse: vi.fn(),
  };

  const renderEnrollment = (props = {}) => {
    return render(<Enrollment {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar os campos e botão corretamente", () => {
      renderEnrollment();

      expect(screen.getByLabelText("Curso")).toBeInTheDocument();
      expect(screen.getByLabelText("Data de Conclusão")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    it("deve renderizar a opção padrão no select", () => {
      renderEnrollment();

      expect(screen.getByDisplayValue("Selecione uma opção")).toBeInTheDocument();
    });

    it("deve renderizar todas as opções de cursos disponíveis", () => {
      renderEnrollment();

      expect(screen.getByText("Mathematics")).toBeInTheDocument();
      expect(screen.getByText("Physics")).toBeInTheDocument();
      expect(screen.getByText("Chemistry")).toBeInTheDocument();
    });

    it("deve ter as classes CSS corretas", () => {
      renderEnrollment();

      const container = screen.getByLabelText("Curso").closest('div').parentElement;
      expect(container).toHaveClass("flex", "flex-col", "md:flex-row", "md:items-end", "gap-4", "w-full", "px-2");

      const select = screen.getByLabelText("Curso");
      expect(select).toHaveClass("text-gray-medium", "w-full", "px-5", "h-[50px]", "font-medium", "font-sm", "rounded-md", "border", "border-border-input", "mt-2");

      const dateInput = screen.getByLabelText("Data de Conclusão");
      expect(dateInput).toHaveClass("text-gray-medium", "w-full", "px-5", "h-[50px]", "font-medium", "font-sm", "rounded-md", "border", "border-border-input", "mt-2");
    });
  });

  describe("Filtragem de cursos", () => {
    it("deve filtrar cursos já selecionados", () => {
      const allCourses = [{ id: 1, name: "Mathematics" }];
      renderEnrollment({ allCourses });

      expect(screen.queryByText("Mathematics")).not.toBeInTheDocument();
      expect(screen.getByText("Physics")).toBeInTheDocument();
      expect(screen.getByText("Chemistry")).toBeInTheDocument();
    });

    it("deve mostrar todos os cursos quando allCourses está vazio", () => {
      renderEnrollment({ allCourses: [] });

      expect(screen.getByText("Mathematics")).toBeInTheDocument();
      expect(screen.getByText("Physics")).toBeInTheDocument();
      expect(screen.getByText("Chemistry")).toBeInTheDocument();
    });

    it("deve funcionar com arrays undefined ou null", () => {
      renderEnrollment({ courses: null, allCourses: undefined });

      expect(screen.getByDisplayValue("Selecione uma opção")).toBeInTheDocument();
    });
  });

  describe("Interações", () => {
    it("deve chamar setSelectedCourse ao alterar o select", () => {
      const setSelectedCourse = vi.fn();
      renderEnrollment({ setSelectedCourse });

      const select = screen.getByLabelText("Curso");
      fireEvent.change(select, { target: { value: "2" } });

      expect(setSelectedCourse).toHaveBeenCalledWith("2");
    });

    it("deve chamar setCompletionDate ao alterar a data", () => {
      const setCompletionDate = vi.fn();
      renderEnrollment({ setCompletionDate });

      const dateInput = screen.getByLabelText("Data de Conclusão");
      fireEvent.change(dateInput, { target: { value: "2025-12-31" } });

      expect(setCompletionDate).toHaveBeenCalledWith("2025-12-31");
    });

    it("deve chamar handleAddCourse ao clicar no botão", () => {
      const handleAddCourse = vi.fn();
      renderEnrollment({ handleAddCourse });

      const addButton = screen.getByRole("button");
      fireEvent.click(addButton);

      expect(handleAddCourse).toHaveBeenCalledTimes(1);
    });
  });

  describe("Estados", () => {
    it("deve mostrar valores selecionados nos campos", () => {
      renderEnrollment({
        selectedCourse: "2",
        completionDate: "2025-12-31"
      });

      const select = screen.getByLabelText("Curso");
      expect(select).toHaveValue("2");

      const dateInput = screen.getByLabelText("Data de Conclusão");
      expect(dateInput).toHaveValue("2025-12-31");
    });

    it("deve desabilitar campos quando submitting é true", () => {
      renderEnrollment({ submitting: true });

      const select = screen.getByLabelText("Curso");
      const dateInput = screen.getByLabelText("Data de Conclusão");
      const button = screen.getByRole("button");

      expect(select).toBeDisabled();
      expect(dateInput).toBeDisabled();
      expect(button).toBeDisabled();
    });

    it("deve aplicar opacidade ao botão quando desabilitado", () => {
      renderEnrollment({ submitting: true });

      const button = screen.getByRole("button");
      expect(button).toHaveClass("disabled:opacity-50");
    });
  });

  describe("Estrutura HTML", () => {
    it("deve ter labels associados aos inputs corretamente", () => {
      renderEnrollment();

      const courseLabel = screen.getByText("Curso");
      const dateLabel = screen.getByText("Data de Conclusão");

      expect(courseLabel).toHaveAttribute("for", "course");
      expect(dateLabel).toHaveAttribute("for", "completionDate");
    });

    it("deve ter ids corretos nos inputs", () => {
      renderEnrollment();

      const select = screen.getByLabelText("Curso");
      const dateInput = screen.getByLabelText("Data de Conclusão");

      expect(select).toHaveAttribute("id", "course");
      expect(select).toHaveAttribute("name", "course");
      expect(dateInput).toHaveAttribute("id", "completionDate");
      expect(dateInput).toHaveAttribute("name", "completionDate");
    });

    it("deve ter type date no input de data", () => {
      renderEnrollment();

      const dateInput = screen.getByLabelText("Data de Conclusão");
      expect(dateInput).toHaveAttribute("type", "date");
    });

    it("deve ter style inline correto no botão", () => {
      renderEnrollment();

      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ height: "30px", width: "30px" });
    });
  });
});