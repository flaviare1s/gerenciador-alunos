import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConfirmationModal } from "../../components/ConfirmationModal";

describe("Componente ConfirmationModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
  };

  const renderModal = (props = {}) => {
    return render(<ConfirmationModal {...defaultProps} {...props} />);
  };

  describe("Renderização", () => {
    it("deve renderizar o modal quando isOpen é true", () => {
      renderModal();

      expect(screen.getByText("Confirmar Exclusão")).toBeInTheDocument();
      expect(screen.getByText("Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.")).toBeInTheDocument();
      expect(screen.getByText("Cancelar")).toBeInTheDocument();
      expect(screen.getByText("Excluir")).toBeInTheDocument();
    });

    it("não deve renderizar o modal quando isOpen é false", () => {
      renderModal({ isOpen: false });

      expect(screen.queryByText("Confirmar Exclusão")).not.toBeInTheDocument();
    });

    it("deve ter a estrutura correta de classes CSS", () => {
      renderModal();

      const overlay = screen.getByText("Confirmar Exclusão").closest('[class*="fixed"]');
      expect(overlay).toHaveClass("fixed", "inset-0", "flex", "items-center", "justify-center");

      const modal = screen.getByText("Confirmar Exclusão").closest('[class*="bg-white"]');
      expect(modal).toHaveClass("bg-white", "rounded-lg", "shadow-lg", "p-6", "w-96");
    });
  });

  describe("Interações", () => {
    it("deve chamar onClose quando o botão Cancelar é clicado", () => {
      const onClose = vi.fn();
      renderModal({ onClose });

      const cancelButton = screen.getByText("Cancelar");
      fireEvent.click(cancelButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onConfirm quando o botão Excluir é clicado", () => {
      const onConfirm = vi.fn();
      renderModal({ onConfirm });

      const confirmButton = screen.getByText("Excluir");
      fireEvent.click(confirmButton);

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("deve ter os botões com as classes CSS corretas", () => {
      renderModal();

      const cancelButton = screen.getByText("Cancelar");
      expect(cancelButton).toHaveClass("px-4", "py-2", "text-sm", "font-medium", "text-dark-gray", "border", "border-gray-border", "rounded-md", "hover:bg-gray-100", "cursor-pointer");

      const confirmButton = screen.getByText("Excluir");
      expect(confirmButton).toHaveClass("px-4", "py-2", "text-sm", "font-medium", "text-white", "bg-primary", "rounded-md", "hover:bg-primary/90", "cursor-pointer");
    });
  });

  describe("Comportamento", () => {
    it("deve renderizar null quando isOpen é false", () => {
      const { container } = render(<ConfirmationModal isOpen={false} onClose={vi.fn()} onConfirm={vi.fn()} />);

      expect(container.firstChild).toBeNull();
    });

    it("deve ter o overlay com fundo escuro semitransparente", () => {
      renderModal();

      const overlay = screen.getByText("Confirmar Exclusão").closest('[class*="bg-[#0000007b]"]');
      expect(overlay).toHaveClass("bg-[#0000007b]");
    });

    it("deve ter título e descrição corretos", () => {
      renderModal();

      const title = screen.getByRole("heading", { level: 2 });
      expect(title).toHaveTextContent("Confirmar Exclusão");
      expect(title).toHaveClass("text-lg", "font-semibold", "text-neutral-black", "mb-4");

      const description = screen.getByText("Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.");
      expect(description).toHaveClass("text-sm", "text-dark-gray", "mb-6");
    });
  });
});