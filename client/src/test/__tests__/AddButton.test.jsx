import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { AddButton } from "../../components/AddButton";

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
vi.mock("react-icons/md", () => ({
  MdOutlineLibraryAdd: ({ className }) => (
    <span className={className} data-testid="course-icon">📚</span>
  ),
}));

describe("Componente AddButton", () => {
  const renderAddButton = (props = {}) => {
    return render(
      <BrowserRouter>
        <AddButton {...props} />
      </BrowserRouter>
    );
  };

  describe("Renderização básica", () => {
    it("deve renderizar o botão com texto 'Adicionar'", () => {
      renderAddButton();

      expect(screen.getByText("Adicionar")).toBeInTheDocument();
    });

    it("deve ter o data-testid correto", () => {
      renderAddButton();

      expect(screen.getByTestId("add-button")).toBeInTheDocument();
    });

    it("deve ter as classes CSS corretas", () => {
      renderAddButton();

      const button = screen.getByTestId("add-button");
      expect(button).toHaveClass(
        "flex",
        "items-center",
        "justify-center",
        "gap-2",
        "py-2",
        "px-6",
        "text-neutral-black",
        "text-sm",
        "border",
        "border-gray-medium",
        "rounded-md",
        "cursor-pointer",
        "hover:bg-gray-light",
        "hover:text-primary",
        "w-full",
        "sm:w-auto"
      );
    });
  });

  describe("Tipo student (padrão)", () => {
    it("deve navegar para /cadastro-aluno quando type é student", () => {
      renderAddButton({ type: "student" });

      const button = screen.getByTestId("add-button");
      expect(button).toHaveAttribute("href", "/cadastro-aluno");
    });

    it("deve navegar para /cadastro-aluno quando type não é especificado", () => {
      renderAddButton();

      const button = screen.getByTestId("add-button");
      expect(button).toHaveAttribute("href", "/cadastro-aluno");
    });

    it("deve renderizar ícone de imagem para student", () => {
      renderAddButton({ type: "student" });

      const image = screen.getByAltText("");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("alt", "");
      expect(image).toHaveAttribute("aria-hidden", "true");
      expect(image).toHaveClass("w-full", "mt-1");
    });
  });

  describe("Tipo course", () => {
    it("deve navegar para /cadastro-curso quando type é course", () => {
      renderAddButton({ type: "course" });

      const button = screen.getByTestId("add-button");
      expect(button).toHaveAttribute("href", "/cadastro-curso");
    });

    it("deve renderizar ícone de biblioteca para course", () => {
      renderAddButton({ type: "course" });

      const courseIcon = screen.getByTestId("course-icon");
      expect(courseIcon).toBeInTheDocument();
      expect(courseIcon).toHaveClass("text-primary", "text-2xl");
    });

    it("não deve renderizar imagem quando type é course", () => {
      renderAddButton({ type: "course" });

      const image = screen.queryByAltText("");
      expect(image).not.toBeInTheDocument();
    });
  });

  describe("Estrutura do componente", () => {
    it("deve ter a estrutura correta com span para ícone e texto", () => {
      renderAddButton();

      const button = screen.getByTestId("add-button");
      const spans = button.querySelectorAll("span");

      expect(spans).toHaveLength(2);
      expect(spans[0]).toHaveClass("w-6", "h-6", "flex", "items-center", "justify-center");
      expect(spans[1]).toHaveTextContent("Adicionar");
    });

    it("deve ser um elemento de link (tag 'a')", () => {
      renderAddButton();

      const button = screen.getByTestId("add-button");
      expect(button.tagName).toBe("A");
    });
  });

  describe("Casos especiais", () => {
    it("deve funcionar com values inválidos de type", () => {
      renderAddButton({ type: "invalid" });

      const button = screen.getByTestId("add-button");
      expect(button).toHaveAttribute("href", "/cadastro-curso");
    });

    it("deve ter acessibilidade correta", () => {
      renderAddButton({ type: "student" });

      const image = screen.getByAltText("");
      expect(image).toHaveAttribute("aria-hidden", "true");
    });

    it("deve ter estrutura responsiva", () => {
      renderAddButton();

      const button = screen.getByTestId("add-button");
      expect(button).toHaveClass("w-full", "sm:w-auto");
    });
  });

  describe("Interação e estados", () => {
    it("deve ter estados de hover configurados", () => {
      renderAddButton();

      const button = screen.getByTestId("add-button");
      expect(button).toHaveClass("hover:bg-gray-light", "hover:text-primary");
    });

    it("deve ter cursor pointer", () => {
      renderAddButton();

      const button = screen.getByTestId("add-button");
      expect(button).toHaveClass("cursor-pointer");
    });
  });
});