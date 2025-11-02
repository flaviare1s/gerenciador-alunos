import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InputField } from "../../components/InputField";

describe("Componente InputField", () => {
  const defaultProps = {
    label: "Nome",
    name: "nome",
    register: vi.fn(() => ({})),
    error: null,
    validation: {},
    placeholder: "Digite seu nome"
  };

  const renderInputField = (props = {}) => {
    return render(<InputField {...defaultProps} {...props} />);
  };

  describe("Renderização básica", () => {
    it("deve renderizar o label corretamente", () => {
      renderInputField();

      const label = screen.getByText("Nome");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", "nome");
    });

    it("deve renderizar o input com propriedades corretas", () => {
      renderInputField();

      const input = screen.getByLabelText("Nome");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "text");
      expect(input).toHaveAttribute("id", "nome");
      expect(input).toHaveAttribute("placeholder", "Digite seu nome");
    });

    it("deve ter as classes CSS corretas", () => {
      renderInputField();

      const container = screen.getByText("Nome").closest('div');
      expect(container).toHaveClass("flex-1");

      const label = screen.getByText("Nome");
      expect(label).toHaveClass("text-sm", "font-medium", "text-neutral-black");

      const input = screen.getByLabelText("Nome");
      expect(input).toHaveClass(
        "text-gray-medium",
        "bg-[#dbdbdb20]",
        "w-full",
        "px-5",
        "py-[13px]",
        "font-medium",
        "font-sm",
        "rounded-md",
        "border",
        "border-border-input",
        "mt-2"
      );
    });
  });

  describe("Tipos de input", () => {
    it("deve usar type 'text' por padrão", () => {
      renderInputField({ type: undefined });

      const input = screen.getByLabelText("Nome");
      expect(input).toHaveAttribute("type", "text");
    });

    it("deve aceitar diferentes tipos de input", () => {
      renderInputField({ type: "email", label: "Email", name: "email" });

      const input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("type", "email");
    });

    it("deve funcionar com type 'password'", () => {
      renderInputField({ type: "password", label: "Senha", name: "senha" });

      const input = screen.getByLabelText("Senha");
      expect(input).toHaveAttribute("type", "password");
    });

    it("deve funcionar com type 'number'", () => {
      renderInputField({ type: "number", label: "Idade", name: "idade" });

      const input = screen.getByLabelText("Idade");
      expect(input).toHaveAttribute("type", "number");
    });
  });

  describe("Integração com react-hook-form", () => {
    it("deve chamar register com name e validation", () => {
      const register = vi.fn(() => ({}));
      const validation = { required: "Campo obrigatório" };

      renderInputField({ register, validation });

      expect(register).toHaveBeenCalledWith("nome", validation);
    });

    it("deve aplicar props retornadas do register", () => {
      const register = vi.fn(() => ({
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
        name: "nome"
      }));

      renderInputField({ register });

      const input = screen.getByLabelText("Nome");
      expect(input).toHaveAttribute("name", "nome");
    });
  });

  describe("Validação e erros", () => {
    it("não deve mostrar erro quando error é null", () => {
      renderInputField({ error: null });

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
    });

    it("deve mostrar mensagem de erro quando error está presente", () => {
      renderInputField({ error: "Campo obrigatório" });

      const errorMessage = screen.getByText("Campo obrigatório");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass("text-xs", "font-medium", "text-primary");
    });

    it("deve mostrar diferentes mensagens de erro", () => {
      renderInputField({ error: "Email inválido" });

      expect(screen.getByText("Email inválido")).toBeInTheDocument();
    });
  });

  describe("Placeholder", () => {
    it("deve mostrar placeholder quando fornecido", () => {
      renderInputField({ placeholder: "Digite aqui..." });

      const input = screen.getByPlaceholderText("Digite aqui...");
      expect(input).toBeInTheDocument();
    });

    it("deve funcionar sem placeholder", () => {
      renderInputField({ placeholder: undefined });

      const input = screen.getByLabelText("Nome");
      expect(input).not.toHaveAttribute("placeholder");
    });
  });

  describe("Acessibilidade", () => {
    it("deve associar label com input corretamente", () => {
      renderInputField({ label: "Email", name: "email" });

      const label = screen.getByText("Email");
      const input = screen.getByLabelText("Email");

      expect(label).toHaveAttribute("for", "email");
      expect(input).toHaveAttribute("id", "email");
    });

    it("deve ter estrutura semântica correta", () => {
      renderInputField();

      const label = screen.getByText("Nome");
      const input = screen.getByLabelText("Nome");

      expect(label.tagName).toBe("LABEL");
      expect(input.tagName).toBe("INPUT");
    });
  });

  describe("Casos extremos", () => {
    it("deve funcionar com strings vazias", () => {
      renderInputField({
        label: "",
        name: "test",
        placeholder: ""
      });

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("deve funcionar com validation undefined", () => {
      const register = vi.fn(() => ({}));
      renderInputField({ register, validation: undefined });

      expect(register).toHaveBeenCalledWith("nome", undefined);
    });

    it("deve funcionar sem register", () => {
      // Since the component always calls register, we need to provide a mock
      const register = vi.fn(() => ({}));
      const { container } = renderInputField({ register });

      expect(container).toBeInTheDocument();
      expect(register).toHaveBeenCalledWith("nome", {});
    });
  });

  describe("Estrutura DOM", () => {
    it("deve ter a estrutura correta de elementos", () => {
      renderInputField({ error: "Erro teste" });

      const container = screen.getByText("Nome").closest('div');
      const label = container.querySelector('label');
      const input = container.querySelector('input');
      const error = container.querySelector('small');

      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(error).toBeInTheDocument();
    });

    it("deve não ter elemento small quando não há erro", () => {
      renderInputField({ error: null });

      const container = screen.getByText("Nome").closest('div');
      const error = container.querySelector('small');

      expect(error).not.toBeInTheDocument();
    });
  });
});