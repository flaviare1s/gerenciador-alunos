import { render, screen, fireEvent } from "@testing-library/react";
import { StudentCourse } from "../../components/StudentCourse";
import { describe, it, expect } from "vitest";
import { vi } from "vitest";

const mockCourses = [
  {
    enrollmentId: "1",
    id: "101",
    name: "Mathematics",
    completionDate: "2025-10-29",
    status: "COMPLETED",
  },
  {
    enrollmentId: "2",
    id: "102",
    name: "Physics",
    completionDate: "",
    status: "IN_PROGRESS",
  },
];

describe("Componente StudentCourse", () => {
  it("deve renderizar os cursos corretamente", () => {
    render(
      <StudentCourse
        allCourses={mockCourses}
        handleRemoveCourse={vi.fn()}
        handleUpdateCourse={vi.fn()}
        isCreateMode={false}
      />
    );

    expect(screen.getByText("Mathematics")).toBeInTheDocument();
    expect(screen.getByText("Physics")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /remover curso/i })).toHaveLength(2);
  });

  it("deve chamar handleRemoveCourse quando o botão de remover curso for clicado", () => {
    const handleRemoveCourse = vi.fn();

    render(
      <StudentCourse
        allCourses={mockCourses}
        handleRemoveCourse={handleRemoveCourse}
        handleUpdateCourse={vi.fn()}
        isCreateMode={false}
      />
    );

    const removeButtons = screen.getAllByRole("button", { name: /remover curso/i });
    fireEvent.click(removeButtons[0]);

    expect(handleRemoveCourse).toHaveBeenCalledWith("1");
  });

  it("deve chamar handleUpdateCourse quando a data for alterada e isCreateMode for false", () => {
    const handleUpdateCourse = vi.fn();

    render(
      <StudentCourse
        allCourses={mockCourses}
        handleRemoveCourse={vi.fn()}
        handleUpdateCourse={handleUpdateCourse}
        isCreateMode={false}
      />
    );

    const dateInputs = screen.getAllByDisplayValue(mockCourses[0].completionDate);
    fireEvent.change(dateInputs[0], { target: { value: "2025-11-01" } });

    expect(handleUpdateCourse).toHaveBeenCalledWith(
      mockCourses[0].enrollmentId,
      mockCourses[0].id,
      "2025-11-01"
    );
  });

  it("deve renderizar os campos de data como desabilitados em modo de criação", () => {
    render(
      <StudentCourse
        allCourses={mockCourses}
        handleRemoveCourse={vi.fn()}
        handleUpdateCourse={vi.fn()}
        isCreateMode={true}
      />
    );

    const dateInputs = screen.getAllByDisplayValue(/2025-10-29|/);
    expect(dateInputs[0]).toBeDisabled();
  });

  it("deve renderizar o ícone de status correto com base no status do curso", () => {
    render(
      <StudentCourse
        allCourses={mockCourses}
        handleRemoveCourse={vi.fn()}
        handleUpdateCourse={vi.fn()}
        isCreateMode={false}
      />
    );

    expect(screen.getByAltText("Concluído")).toBeInTheDocument();
    expect(screen.getByTitle("Curso em andamento")).toBeInTheDocument();
  });
});