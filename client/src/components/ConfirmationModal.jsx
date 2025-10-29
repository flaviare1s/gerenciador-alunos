/**
 * Componente reutilizável de modal de confirmação de exclusão.
 * 
 * Este modal exibe uma mensagem de confirmação quando o usuário tenta excluir um item.
 */

export const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0000007b]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-neutral-black mb-4">Confirmar Exclusão</h2>
        <p className="text-sm text-dark-gray mb-6">Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-dark-gray border border-gray-border rounded-md hover:bg-gray-100 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};
