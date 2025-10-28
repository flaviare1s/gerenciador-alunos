import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Importa o MemoryRouter
import App from '../../App';

describe('Componente App', () => {
  it('deve renderizar o Header', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
