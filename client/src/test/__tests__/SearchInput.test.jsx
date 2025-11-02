import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { SearchInput } from "../../components/SearchInput";

// Mock do react-icons
vi.mock("react-icons/fi", () => ({
  FiSearch: ({ className }) => (
    <span className={className} data-testid="search-icon" aria-hidden="true">🔍</span>
  ),
}));

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe("Componente SearchInput", () => {
  const defaultProps = {
    search: "",
    setSearch: vi.fn(),
    placeholder: "Buscar alunos..."
  };

  const renderSearchInput = (props = {}) => {
    return render(<SearchInput {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização", () => {
    it("deve renderizar o campo de busca com placeholder", () => {
      renderSearchInput();

      const input = screen.getByTestId("search-input");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("placeholder", "Buscar alunos...");
      expect(input).toHaveAttribute("type", "search");
    });

    it("deve renderizar o ícone de busca", () => {
      renderSearchInput();

      const icon = screen.getByTestId("search-icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("deve ter a estrutura CSS correta", () => {
      renderSearchInput();

      const container = screen.getByTestId("search-input").closest('div');
      expect(container).toHaveClass("relative", "w-full");

      const input = screen.getByTestId("search-input");
      expect(input).toHaveClass(
        "text-gray-medium",
        "py-2",
        "pl-3",
        "pr-10",
        "font-medium",
        "border",
        "border-gray-light",
        "rounded-md",
        "w-full",
        "focus:outline-none",
        "focus:ring-1",
        "focus:ring-primary"
      );

      const icon = screen.getByTestId("search-icon");
      expect(icon).toHaveClass(
        "absolute",
        "right-3",
        "top-1/2",
        "-translate-y-1/2",
        "text-dark-gray",
        "text-lg",
        "cursor-pointer"
      );
    });
  });

  describe("Valor e placeholder", () => {
    it("deve mostrar o valor atual no campo", () => {
      renderSearchInput({ search: "João Silva" });

      const input = screen.getByTestId("search-input");
      expect(input).toHaveValue("João Silva");
    });

    it("deve aceitar diferentes placeholders", () => {
      renderSearchInput({ placeholder: "Buscar cursos..." });

      const input = screen.getByTestId("search-input");
      expect(input).toHaveAttribute("placeholder", "Buscar cursos...");
    });

    it("deve funcionar com placeholder vazio", () => {
      renderSearchInput({ placeholder: "" });

      const input = screen.getByTestId("search-input");
      expect(input).toHaveAttribute("placeholder", "");
    });
  });

  describe("Interações", () => {
    it("deve chamar setSearch ao digitar", () => {
      const setSearch = vi.fn();
      renderSearchInput({ setSearch });

      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "teste" } });

      expect(setSearch).toHaveBeenCalledWith("teste");
    });

    it("deve salvar no localStorage ao digitar", () => {
      renderSearchInput();

      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "busca teste" } });

      expect(localStorageMock.setItem).toHaveBeenCalledWith("searchTerm", "busca teste");
    });

    it("deve funcionar com string vazia", () => {
      const setSearch = vi.fn();
      renderSearchInput({ setSearch, search: "algum valor" });

      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "" } });

      expect(setSearch).toHaveBeenCalledWith("");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("searchTerm", "");
    });
  });

  describe("Persistência localStorage", () => {
    it("deve carregar valor salvo do localStorage na inicialização", async () => {
      localStorageMock.getItem.mockReturnValue("valor salvo");
      const setSearch = vi.fn();

      renderSearchInput({ setSearch });

      await waitFor(() => {
        expect(localStorageMock.getItem).toHaveBeenCalledWith("searchTerm");
        expect(setSearch).toHaveBeenCalledWith("valor salvo");
      });
    });

    it("não deve chamar setSearch se não houver valor no localStorage", async () => {
      localStorageMock.getItem.mockReturnValue(null);
      const setSearch = vi.fn();

      renderSearchInput({ setSearch });

      await waitFor(() => {
        expect(localStorageMock.getItem).toHaveBeenCalledWith("searchTerm");
      });

      expect(setSearch).not.toHaveBeenCalled();
    });

    it("deve falhar se localStorage não estiver disponível", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage not available");
      });

      expect(() => renderSearchInput()).toThrow("localStorage not available");
    });
  });

  describe("Eventos de mudança", () => {
    it("deve atualizar valor e localStorage em cada mudança", () => {
      const setSearch = vi.fn();
      renderSearchInput({ setSearch });

      const input = screen.getByTestId("search-input");

      fireEvent.change(input, { target: { value: "a" } });
      expect(setSearch).toHaveBeenCalledWith("a");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("searchTerm", "a");

      fireEvent.change(input, { target: { value: "ab" } });
      expect(setSearch).toHaveBeenCalledWith("ab");
      expect(localStorageMock.setItem).toHaveBeenCalledWith("searchTerm", "ab");
    });

    it("deve manter outros eventos do input funcionando", () => {
      renderSearchInput();

      const input = screen.getByTestId("search-input");

      fireEvent.focus(input);
      fireEvent.blur(input);

      // Não deve quebrar outros comportamentos
      expect(input).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter ícone com aria-hidden", () => {
      renderSearchInput();

      const icon = screen.getByTestId("search-icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("deve ser um input do tipo search", () => {
      renderSearchInput();

      const input = screen.getByTestId("search-input");
      expect(input).toHaveAttribute("type", "search");
    });

    it("deve ter estados de foco configurados", () => {
      renderSearchInput();

      const input = screen.getByTestId("search-input");
      expect(input).toHaveClass("focus:outline-none", "focus:ring-1", "focus:ring-primary");
    });
  });

  describe("Estrutura DOM", () => {
    it("deve ter container relativo com input e ícone", () => {
      renderSearchInput();

      const container = screen.getByTestId("search-input").closest('div');
      const input = container.querySelector('input');
      const icon = container.querySelector('[data-testid="search-icon"]');

      expect(container).toHaveClass("relative");
      expect(input).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
    });

    it("deve posicionar ícone corretamente", () => {
      renderSearchInput();

      const icon = screen.getByTestId("search-icon");
      expect(icon).toHaveClass("absolute", "right-3", "top-1/2", "-translate-y-1/2");
    });
  });
});