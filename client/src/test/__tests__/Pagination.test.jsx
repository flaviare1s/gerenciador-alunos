import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { Pagination } from "../../components/Pagination";

// Mock dos ícones do react-icons
vi.mock("react-icons/hi", () => ({
  HiArrowLeft: ({ className }) => <span className={className} data-testid="arrow-left">←</span>,
  HiArrowRight: ({ className }) => <span className={className} data-testid="arrow-right">→</span>,
}));

describe("Componente Pagination", () => {
  const defaultProps = {
    totalPages: 5,
    currentPage: 1,
    onPageChange: vi.fn(),
  };

  const renderPagination = (props = {}) => {
    return render(<Pagination {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização básica", () => {
    it("deve renderizar os botões Anterior e Próximo", () => {
      renderPagination();

      expect(screen.getByText("Anterior")).toBeInTheDocument();
      expect(screen.getByText("Próximo")).toBeInTheDocument();
    });

    it("deve renderizar os números das páginas", () => {
      renderPagination();

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("deve destacar a página atual", () => {
      renderPagination({ currentPage: 3 });

      const currentPageButton = screen.getByText("3");
      expect(currentPageButton).toHaveClass("bg-light-blue", "text-neutral-black");
    });

    it("deve renderizar páginas não ativas com estilo diferente", () => {
      renderPagination({ currentPage: 3 });

      const inactivePageButton = screen.getByText("1");
      expect(inactivePageButton).toHaveClass("bg-white", "text-gray-medium");
    });
  });

  describe("Navegação", () => {
    it("deve chamar onPageChange ao clicar em um número de página", () => {
      const onPageChange = vi.fn();
      renderPagination({ onPageChange });

      const pageButton = screen.getByText("2");
      fireEvent.click(pageButton);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("deve navegar para a página anterior quando Anterior é clicado", () => {
      const onPageChange = vi.fn();
      renderPagination({ currentPage: 3, onPageChange });

      const previousButton = screen.getByText("Anterior");
      fireEvent.click(previousButton);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("deve navegar para a próxima página quando Próximo é clicado", () => {
      const onPageChange = vi.fn();
      renderPagination({ currentPage: 3, onPageChange });

      const nextButton = screen.getByText("Próximo");
      fireEvent.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(4);
    });
  });

  describe("Estados dos botões", () => {
    it("deve desabilitar o botão Anterior na primeira página", () => {
      renderPagination({ currentPage: 1 });

      const previousButton = screen.getByText("Anterior");
      expect(previousButton).toBeDisabled();
      expect(previousButton).toHaveClass("disabled:opacity-50");
    });

    it("deve desabilitar o botão Próximo na última página", () => {
      renderPagination({ currentPage: 5, totalPages: 5 });

      const nextButton = screen.getByText("Próximo");
      expect(nextButton).toBeDisabled();
      expect(nextButton).toHaveClass("disabled:opacity-50");
    });

    it("não deve chamar onPageChange ao clicar em Anterior na primeira página", () => {
      const onPageChange = vi.fn();
      renderPagination({ currentPage: 1, onPageChange });

      const previousButton = screen.getByText("Anterior");
      fireEvent.click(previousButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it("não deve chamar onPageChange ao clicar em Próximo na última página", () => {
      const onPageChange = vi.fn();
      renderPagination({ currentPage: 5, totalPages: 5, onPageChange });

      const nextButton = screen.getByText("Próximo");
      fireEvent.click(nextButton);

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe("Paginação com muitas páginas", () => {
    it("deve mostrar reticências quando há muitas páginas", () => {
      renderPagination({ totalPages: 10, currentPage: 5 });

      const ellipsis = screen.getAllByText("...");
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it("deve mostrar páginas adjacentes à página atual", () => {
      renderPagination({ totalPages: 10, currentPage: 5 });

      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument();
    });

    it("deve sempre mostrar a primeira e última página", () => {
      renderPagination({ totalPages: 10, currentPage: 5 });

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  describe("Casos extremos", () => {
    it("deve funcionar com apenas 1 página", () => {
      renderPagination({ totalPages: 1, currentPage: 1 });

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("Anterior")).toBeDisabled();
      expect(screen.getByText("Próximo")).toBeDisabled();
    });

    it("deve funcionar com 2 páginas", () => {
      renderPagination({ totalPages: 2, currentPage: 1 });

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.queryByText("...")).not.toBeInTheDocument();
    });

    it("deve ter estrutura CSS correta", () => {
      renderPagination();

      const container = screen.getByText("Anterior").closest('div');
      expect(container).toHaveClass("flex", "items-center", "justify-center", "pt-9", "space-x-2");
    });
  });

  describe("Ícones", () => {
    it("deve renderizar os ícones de seta", () => {
      renderPagination();

      expect(screen.getByTestId("arrow-left")).toBeInTheDocument();
      expect(screen.getByTestId("arrow-right")).toBeInTheDocument();
    });

    it("deve ter classes CSS corretas nos ícones", () => {
      renderPagination();

      const leftIcon = screen.getByTestId("arrow-left");
      expect(leftIcon).toHaveClass("inline-block", "mr-1");

      const rightIcon = screen.getByTestId("arrow-right");
      expect(rightIcon).toHaveClass("inline-block", "ml-1");
    });
  });
});