import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "react-hot-toast";
import { StudentCoursesManager } from "../../components/StudentCoursesManager";

import * as enrollmentService from "../../services/enrollment";
import * as studentService from "../../services/student";

vi.mock("../../services/enrollment");
vi.mock("../../services/student");

vi.mock("react-hot-toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../contexts/PageContext", () => ({
  usePage: () => ({
    setPageData: vi.fn(),
  }),
}));

const mockStudent = {
  id: "1",
  firstName: "João",
  lastName: "Silva",
  email: "joao@email.com",
  gender: "MALE",
  zipCode: "60100000",
  city: "Fortaleza",
  state: "CE",
  country: "Brasil",
  enrollments: [
    {
      id: "enroll1",
      courseId: 1,
      completionDate: "2025-10-29",
      status: "COMPLETED",
      course: {
        id: 1,
        name: "Mathematics",
        description: "Advanced Mathematics"
      }
    },
    {
      id: "enroll2",
      courseId: 2,
      completionDate: null,
      status: "IN_PROGRESS",
      course: {
        id: 2,
        name: "Physics",
        description: "Basic Physics"
      }
    }
  ]
};

const mockCourses = [
  { id: 1, name: "Mathematics", description: "Advanced Mathematics" },
  { id: 2, name: "Physics", description: "Basic Physics" },
  { id: 3, name: "Chemistry", description: "Basic Chemistry" }
];

const renderComponent = (props = {}) => {
  const defaultProps = {
    studentId: "1",
    courses: mockCourses,
    isCreateMode: false,
    pendingCourses: [],
    setPendingCourses: vi.fn()
  };

  return render(<StudentCoursesManager {...defaultProps} {...props} />);
};

describe("Componente StudentCoursesManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    studentService.getStudentById.mockResolvedValue(mockStudent);
    enrollmentService.createEnrollment.mockResolvedValue({ id: "newEnroll" });
    enrollmentService.updateEnrollment.mockResolvedValue({ success: true });
    enrollmentService.deleteEnrollment.mockResolvedValue({ success: true });
  });

  describe("Renderização básica", () => {
    it("deve renderizar o título", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Cursos")).toBeInTheDocument();
      });
    });

    it("deve exibir cursos matriculados no modo edição", async () => {
      renderComponent({ studentId: "1" });

      await waitFor(() => {
        expect(screen.getByText("Mathematics")).toBeInTheDocument();
        expect(screen.getByText("Physics")).toBeInTheDocument();
      });
    });

    it("deve exibir mensagem quando não há cursos", async () => {
      const studentSemCursos = { ...mockStudent, enrollments: [] };
      studentService.getStudentById.mockResolvedValue(studentSemCursos);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Cursos")).toBeInTheDocument();
      });

      const coursesContainer = screen.getByText("Cursos").nextElementSibling;
      expect(coursesContainer.querySelector('[disabled]')).not.toBeInTheDocument();
    });
  });

  describe("Adicionar curso", () => {
    it("deve adicionar curso com sucesso", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Mathematics")).toBeInTheDocument();
      });

      const select = screen.getByDisplayValue("Selecione uma opção");
      fireEvent.change(select, { target: { value: "3" } });

      const dateInput = screen.getByLabelText("Data de Conclusão");
      fireEvent.change(dateInput, { target: { value: "2025-12-31" } });

      const buttons = screen.getAllByRole("button");
      const addButton = buttons[buttons.length - 1];
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(enrollmentService.createEnrollment).toHaveBeenCalledWith({
          studentId: 1,
          courseId: 3,
          completionDate: expect.stringMatching(/^2025-12-31T\d{2}:00:00\.000Z$/)
        });
      });
    });

    it("deve mostrar erro quando não selecionar curso", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Mathematics")).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole("button");
      const addButton = buttons[buttons.length - 1];
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Selecione um curso");
      });
    });

    it("deve mostrar erro quando não definir data", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Mathematics")).toBeInTheDocument();
      });

      const select = screen.getByDisplayValue("Selecione uma opção");
      fireEvent.change(select, { target: { value: "3" } });

      const buttons = screen.getAllByRole("button");
      const addButton = buttons[buttons.length - 1];
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("A data de conclusão é obrigatória.");
      });
    });
  }); describe("Remover curso", () => {
    it("deve abrir modal de confirmação", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Mathematics")).toBeInTheDocument();
      });

      const removeButton = screen.getAllByRole("button", { name: /remover curso/i })[0];
      fireEvent.click(removeButton);

      expect(screen.getByText("Confirmar Exclusão")).toBeInTheDocument();
    });

    it("deve cancelar remoção", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Mathematics")).toBeInTheDocument();
      });

      const removeButton = screen.getAllByRole("button", { name: /remover curso/i })[0];
      fireEvent.click(removeButton);

      const cancelButton = screen.getByText("Cancelar");
      fireEvent.click(cancelButton);

      expect(screen.queryByText("Confirmar Exclusão")).not.toBeInTheDocument();
      expect(enrollmentService.deleteEnrollment).not.toHaveBeenCalled();
    });

    it("deve remover curso ao confirmar", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Mathematics")).toBeInTheDocument();
      });

      const removeButton = screen.getAllByRole("button", { name: /remover curso/i })[0];
      fireEvent.click(removeButton);

      const confirmButton = screen.getByText("Excluir");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(enrollmentService.deleteEnrollment).toHaveBeenCalled();
      });
    });
  });

  describe("Atualizar curso", () => {
    it("deve atualizar data de conclusão", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Mathematics")).toBeInTheDocument();
      });

      const dateInput = screen.getAllByDisplayValue("2025-10-29")[0];
      fireEvent.change(dateInput, { target: { value: "2025-11-15" } });

      await waitFor(() => {
        expect(enrollmentService.updateEnrollment).toHaveBeenCalled();
      });
    });

    it("deve mostrar erro ao falhar na atualização", async () => {
      enrollmentService.updateEnrollment.mockRejectedValue(new Error("Erro"));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Mathematics")).toBeInTheDocument();
      });

      const dateInput = screen.getAllByDisplayValue("2025-10-29")[0];
      fireEvent.change(dateInput, { target: { value: "2025-11-15" } });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao atualizar data de conclusão.");
      });
    });
  });

  describe("Modo criação", () => {
    it("deve funcionar no modo criação", () => {
      const mockPendingCourses = [
        { id: 1, name: "Math", completionDate: "2025-12-01" }
      ];

      renderComponent({
        isCreateMode: true,
        pendingCourses: mockPendingCourses
      });

      expect(screen.getByText("Cursos")).toBeInTheDocument();
      expect(screen.getByText("Math")).toBeInTheDocument();
    });

    it("deve desabilitar inputs de data no modo criação", () => {
      const mockPendingCourses = [
        { id: 1, name: "Math", completionDate: "2025-12-01" }
      ];

      renderComponent({
        isCreateMode: true,
        pendingCourses: mockPendingCourses
      });

      const dateInput = screen.getByDisplayValue("2025-12-01");
      expect(dateInput).toBeDisabled();
    });
  });

  describe("Tratamento de erros", () => {
    it("deve exibir erro ao falhar carregamento do estudante", async () => {
      studentService.getStudentById.mockRejectedValue(new Error("Erro de rede"));

      renderComponent();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao carregar cursos do aluno");
      });
    });

    it("deve exibir erro ao falhar criação de matrícula", async () => {
      enrollmentService.createEnrollment.mockRejectedValue(new Error("Erro"));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Mathematics")).toBeInTheDocument();
      });

      const select = screen.getByDisplayValue("Selecione uma opção");
      fireEvent.change(select, { target: { value: "3" } });

      const dateInput = screen.getByLabelText("Data de Conclusão");
      fireEvent.change(dateInput, { target: { value: "2025-12-31" } });

      const buttons = screen.getAllByRole("button");
      const addButton = buttons[buttons.length - 1];
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao criar matrícula. Tente novamente.");
      });
    });
  });
});
