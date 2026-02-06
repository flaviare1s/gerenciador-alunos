/**
 * Modal informativo sobre o banco de dados pausado.
 * 
 * Este modal é exibido ao carregar a aplicação para informar aos usuários
 * que o banco de dados está temporariamente pausado.
 */

export const DatabasePausedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0000007b] z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-[90%]">
        <div className="flex flex-col items-center">
          <div className="bg-yellow-100 rounded-full p-3 mb-4">
            <svg 
              className="w-8 h-8 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-black mb-3 text-center">
            Banco de Dados Pausado
          </h2>
          <p className="text-sm text-dark-gray mb-6 text-center">
            O banco de dados Supabase está temporariamente pausado. 
            As funcionalidades da aplicação podem estar limitadas no momento.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 cursor-pointer transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};
