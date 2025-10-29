import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CourseForm } from "../../pages/CourseForm";
import * as courseService from "../../services/course";
import toast from "react-hot-toast";

vi.mock("../../services/course");
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }));

describe("Componente CourseForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = (route = "/courses/new") => {
    window.history.pushState({}, "", route);
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/courses/new" element={<CourseForm />} />
          <Route path="/courses/:id" element={<CourseForm />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("deve renderizar o formulário de cadastro de curso corretamente", () => {
    renderForm();
    expect(screen.getByRole('heading', { name: /Cadastrar Curso/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite o nome do curso/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cadastrar Curso/i })).toBeInTheDocument();
  });

  it("deve cadastrar um novo curso", async () => {
    courseService.createCourse.mockResolvedValue({ id: 10 });

    renderForm();

    const input = screen.getByPlaceholderText(/Digite o nome do curso/i);
    fireEvent.change(input, { target: { value: "React Avançado" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar Curso/i }));

    await waitFor(() => {
      expect(courseService.createCourse).toHaveBeenCalledWith({ name: "React Avançado" });
      expect(toast.success).toHaveBeenCalledWith("Curso criado com sucesso!");
    });
  });

  it("deve carregar os dados do curso no modo de edição", async () => {
    courseService.getCourseById.mockResolvedValue({ name: "React Intermediário" });

    renderForm("/courses/5");

    await waitFor(() => {
      expect(screen.getByDisplayValue("React Intermediário")).toBeInTheDocument();
    });
  });

  it("deve atualizar o curso no modo de edição", async () => {
    courseService.getCourseById.mockResolvedValue({ name: "Curso Antigo" });
    courseService.updateCourse.mockResolvedValue({});

    renderForm("/courses/7");

    await waitFor(() => expect(screen.getByDisplayValue("Curso Antigo")).toBeInTheDocument());

    const input = screen.getByDisplayValue("Curso Antigo");
    fireEvent.change(input, { target: { value: "Curso Novo" } });

    fireEvent.click(screen.getByRole("button", { name: /Atualizar Curso/i }));

    await waitFor(() => {
      expect(courseService.updateCourse).toHaveBeenCalledWith("7", { name: "Curso Novo" });
      expect(toast.success).toHaveBeenCalledWith("Curso atualizado com sucesso!");
    });
  });

  it("deve mostrar erro ao carregar curso", async () => {
    courseService.getCourseById.mockRejectedValue(new Error("Erro"));

    renderForm("/courses/9");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao carregar curso");
    });
  });
});
