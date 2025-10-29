import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { Student } from "../../components/Student";
import * as studentService from "../../services/student";
import toast from "react-hot-toast";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../services/student");
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }));
vi.mock("../../components/ConfirmationModal", () => ({
  ConfirmationModal: ({ isOpen, onConfirm, onClose }) =>
    isOpen ? (
      <div data-testid="confirmation-modal">
        <button onClick={onConfirm}>Excluir</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    ) : null,
}));

describe("Componente Student", () => {
  const sampleStudent = {
    id: 42,
    firstName: "João",
    lastName: "Silva",
    state: "SP",
    createdAt: "2023-05-01T00:00:00.000Z",
    courses: ["React", "Node", "Prisma"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderRow = (student = sampleStudent) =>
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <Student student={student} onStudentDeleted={vi.fn()} />
          </tbody>
        </table>
      </MemoryRouter>
    );

  it("deve renderizar as informações do aluno e o resumo dos cursos com o badge +N em telas pequenas", () => {
    window.innerWidth = 500;
    renderRow();
    const d = new Date(sampleStudent.createdAt);
    const expectedDate = `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
    expect(screen.getByText(expectedDate)).toBeInTheDocument();

    expect(screen.getByText(/João Silva/)).toBeInTheDocument();

    expect(screen.getByText("SP")).toBeInTheDocument();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("deve renderizar múltiplos badges de curso em telas largas", () => {
    window.innerWidth = 1400;
    renderRow();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node")).toBeInTheDocument();
    expect(screen.getByText("Prisma")).toBeInTheDocument();

    const plus = screen.queryByText(/\+\d+/);
    expect(plus).not.toBeInTheDocument();
  });

  it("deve abrir o modal de confirmação e deletar o aluno ao confirmar", async () => {
    const onDeleted = vi.fn();
    studentService.deleteStudent.mockResolvedValue({});

    render(
      <MemoryRouter>
        <table>
          <tbody>
            <Student student={sampleStudent} onStudentDeleted={onDeleted} />
          </tbody>
        </table>
      </MemoryRouter>
    );

    const row = screen.getByText(/João Silva/).closest("tr");
    const rowWithin = within(row);

    const deleteBtn = rowWithin.getByRole("button");
    fireEvent.click(deleteBtn);

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

    const confirm = screen.getByText("Excluir");
    fireEvent.click(confirm);

    await waitFor(() => {
      expect(studentService.deleteStudent).toHaveBeenCalledWith(42);
      expect(toast.success).toHaveBeenCalledWith("Aluno deletado com sucesso!");
      expect(onDeleted).toHaveBeenCalledWith(42);
    });
  });

  it("deve mostrar erro ao deletar aluno", async () => {
    const onDeleted = vi.fn();
    studentService.deleteStudent.mockRejectedValue(new Error("fail"));

    render(
      <MemoryRouter>
        <table>
          <tbody>
            <Student student={sampleStudent} onStudentDeleted={onDeleted} />
          </tbody>
        </table>
      </MemoryRouter>
    );

    const row = screen.getByText(/João Silva/).closest("tr");
    const rowWithin = within(row);
    const deleteBtn = rowWithin.getByRole("button");
    fireEvent.click(deleteBtn);

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Excluir"));

    await waitFor(() => {
      expect(studentService.deleteStudent).toHaveBeenCalledWith(42);
      expect(toast.error).toHaveBeenCalledWith("Erro ao deletar aluno.");
      expect(onDeleted).not.toHaveBeenCalled();
    });
  });
});
