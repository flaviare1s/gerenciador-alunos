import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "react-hot-toast";
import { StudentForm } from "../../pages/StudentForm";

import * as studentService from "../../services/student";
import * as courseService from "../../services/course";

vi.mock("../../contexts/PageContext", () => ({
  usePage: () => ({
    setPageData: vi.fn(),
  }),
}));

vi.mock("react-hot-toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../services/student");
vi.mock("../../services/course");
vi.mock("../../services/enrollment");

const mockStudent = {
  id: 1,
  firstName: "Flávia",
  lastName: "Reis",
  email: "flavia@email.com",
  gender: "FEMALE",
  zipCode: "60100000",
  city: "Fortaleza",
  state: "CE",
  country: "Brasil",
  enrollments: [],
};

const renderForm = (route = "/student") => {
  window.history.pushState({}, "", route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/student" element={<StudentForm />} />
        <Route path="/student/:id" element={<StudentForm />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("Componente StudentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            logradouro: "Rua Exemplo",
            bairro: "Centro",
            localidade: "Fortaleza",
            uf: "CE",
          }),
      })
    );
  });

  it("renderiza o formulário corretamente", () => {
    renderForm();
    expect(screen.getByText("Nome*")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar aluno")).toBeInTheDocument();
  });

  it("submete corretamente ao criar novo aluno", async () => {
    studentService.createStudent.mockResolvedValue({ id: 99 });
    courseService.getAllCourses.mockResolvedValue([]);

    renderForm();

    fireEvent.change(screen.getByPlaceholderText("Digite seu nome"), { target: { value: "Flávia" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu sobrenome"), { target: { value: "Reis" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu CPF"), { target: { value: "12345678909" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu email"), { target: { value: "teste@email.com" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu CEP"), { target: { value: "60100000" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu país"), { target: { value: "Brasil" } });
    fireEvent.change(screen.getByPlaceholderText("Digite sua rua"), { target: { value: "Rua A" } });
    fireEvent.change(screen.getByPlaceholderText("Digite o número"), { target: { value: "123" } });
    fireEvent.change(screen.getByPlaceholderText("Digite sua cidade"), { target: { value: "Fortaleza" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu estado"), { target: { value: "CE" } });
    fireEvent.change(screen.getByLabelText("Data de nascimento*"), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText("Gênero*"), { target: { value: "FEMALE" } });

    fireEvent.click(screen.getByText("Cadastrar aluno"));

    await waitFor(() => {
      expect(studentService.createStudent).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Aluno cadastrado com sucesso!");
    });
  });

  it("carrega dados do aluno no modo atualização", async () => {
    studentService.getStudentById.mockResolvedValue(mockStudent);
    courseService.getAllCourses.mockResolvedValue([]);

    renderForm("/student/1");

    await waitFor(() => {
      expect(screen.getByDisplayValue("Flávia")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Reis")).toBeInTheDocument();
    });
  });

  it("mostra erro se falhar ao buscar aluno", async () => {
    studentService.getStudentById.mockRejectedValue(new Error("Erro"));
    courseService.getAllCourses.mockResolvedValue([]);

    renderForm("/student/1");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Não foi possível carregar os dados do aluno.");
    });
  });

  it("busca endereço ao digitar CEP válido", async () => {
    courseService.getAllCourses.mockResolvedValue([]);
    renderForm();

    const cepInput = screen.getByPlaceholderText("Digite seu CEP");
    fireEvent.change(cepInput, { target: { value: "60100000" } });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith("https://viacep.com.br/ws/60100000/json/");
    });
  });

  it("exibe erro do backend ao criar aluno com CPF duplicado", async () => {
    studentService.createStudent.mockRejectedValue({
      response: { status: 409, data: { mensagem: "CPF já cadastrado no sistema!" } },
    });
    courseService.getAllCourses.mockResolvedValue([]);

    renderForm();

    // preencher campos mínimos obrigatórios para que o backend seja acionado
    fireEvent.change(screen.getByPlaceholderText("Digite seu nome"), { target: { value: "Flávia" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu sobrenome"), { target: { value: "Reis" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu CPF"), { target: { value: "12345678909" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu email"), { target: { value: "teste@email.com" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu CEP"), { target: { value: "60100000" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu país"), { target: { value: "Brasil" } });
    fireEvent.change(screen.getByPlaceholderText("Digite sua rua"), { target: { value: "Rua A" } });
    fireEvent.change(screen.getByPlaceholderText("Digite o número"), { target: { value: "123" } });
    fireEvent.change(screen.getByPlaceholderText("Digite sua cidade"), { target: { value: "Fortaleza" } });
    fireEvent.change(screen.getByPlaceholderText("Digite seu estado"), { target: { value: "CE" } });
    fireEvent.change(screen.getByLabelText("Data de nascimento*"), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText("Gênero*"), { target: { value: "FEMALE" } });

    fireEvent.click(screen.getByText("Cadastrar aluno"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("CPF já cadastrado no sistema!"), expect.any(Object));
    });
  });
});
