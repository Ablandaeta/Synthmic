import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RetroDisplay } from './RetroDisplay';

describe('<RetroDisplay />', () => {
  it('debería renderizar la etiqueta y el contenido (children)', () => {
    render(
      <RetroDisplay label="FREQ">
        <span>440Hz</span>
      </RetroDisplay>
    );
    
    expect(screen.getByText('FREQ')).toBeInTheDocument();
    expect(screen.getByText('440Hz')).toBeInTheDocument();
  });

  it('debería renderizar correctamente sin etiqueta', () => {
    const { container } = render(<RetroDisplay>SOLO CONTENIDO</RetroDisplay>);
    expect(screen.getByText('SOLO CONTENIDO')).toBeInTheDocument();
    
    const label = container.querySelector('small');
    expect(label).not.toBeInTheDocument();
  });

  it('debería tener la clase base del contenedor', () => {
    const { container } = render(<RetroDisplay>TEST</RetroDisplay>);
    expect(container.firstChild).toHaveClass('retro-display-container');
  });
});
