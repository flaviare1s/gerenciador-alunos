import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

/**
 * Componente reutilizável de paginação.
 * 
 * Este componente exibe uma navegação entre as páginas de cursos.
 * Permite navegar para a página anterior, próxima e selecionar páginas específicas.
 * Mantém o estilo apresentado no Figma.
 * 
 * Props:
 *  - totalPages: o total de páginas disponíveis.
 *  - currentPage: a página atual.
 *  - onPageChange: a função chamada quando uma nova página é selecionada.
 */

export const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-10 h-10 rounded-lg mx-1 text-sm font-medium ${i === currentPage ? "bg-light-blue text-neutral-black" : "bg-white text-gray-medium"
              }`}
          >
            {i}
          </button>
        );
      } else if (
        (i === currentPage - 2 || i === currentPage + 2) &&
        !pages.includes(<span key={`dots-${i}`}>...</span>)
      ) {
        pages.push(
          <span key={`dots-${i}`} className="px-3 py-1 text-dark-gray">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center pt-9 space-x-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="text-dark-gray text-xs cursor-pointer disabled:opacity-50"
      >
        <HiArrowLeft className="inline-block mr-1" /> Anterior
      </button>

      <div className="flex space-x-1">{renderPageNumbers()}</div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="text-dark-gray text-xs cursor-pointer disabled:opacity-50"
      >
        Próximo <HiArrowRight className="inline-block ml-1" />
      </button>
    </div>
  );
};
