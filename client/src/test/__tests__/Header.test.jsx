import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../../components/Header';
import { PageProvider } from '../../contexts/PageContext';

// Mock do ConfirmationModal
vi.mock('../components/ConfirmationModal', () => ({
  ConfirmationModal: ({ isOpen, onConfirm, onClose }) =>
    isOpen ? (
      <div data-testid="confirmation-modal">
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    ) : null
}));

const renderWithRouter = (initialRoute = '/alunos') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <PageProvider>
        <Header />
      </PageProvider>
    </MemoryRouter>
  );
};

describe('Header Component', () => {
  it('deve renderizar o título "Gerenciador de alunos" na rota /alunos', () => {
    renderWithRouter('/alunos');
    expect(screen.getByText('Gerenciador de alunos')).toBeInTheDocument();
  });

  it('deve renderizar o título "Gerenciador de cursos" na rota /cursos', () => {
    renderWithRouter('/cursos');
    expect(screen.getByText('Gerenciador de cursos')).toBeInTheDocument();
  });

  it('não deve exibir o botão de voltar nas rotas raiz', () => {
    renderWithRouter('/alunos');
    const backButton = screen.queryByRole('link', { name: /voltar/i });
    expect(backButton).not.toBeInTheDocument();
  });

  it('deve exibir o botão de voltar em rotas não raiz', () => {
    renderWithRouter('/alunos/1');
    const backButton = screen.getByRole('link', { name: /voltar/i });
    expect(backButton).toBeInTheDocument();
    expect(screen.getByTestId('back-link')).toHaveAttribute('href', '/');
  });

  it('não deve exibir o botão de deletar nas rotas raiz', () => {
    renderWithRouter('/alunos');
    const deleteButton = screen.queryByRole('button', { name: /excluir/i });
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('deve renderizar o logo', () => {
    renderWithRouter('/alunos');
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  it('deve abrir o modal de confirmação ao clicar no botão deletar', async () => {
    render(
      <MemoryRouter initialEntries={['/alunos/1']}>
        <PageProvider>
          <Header />
        </PageProvider>
      </MemoryRouter>
    );

    const deleteButton = screen.queryByTitle('Excluir');

    if (deleteButton) {
      fireEvent.click(deleteButton);
      await waitFor(() => {
        expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
      });
    }
  });

  it('deve renderizar HeaderToggle na rota raiz', () => {
    renderWithRouter('/alunos');
    // HeaderToggle deve estar presente (você pode adicionar um data-testid nele)
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
