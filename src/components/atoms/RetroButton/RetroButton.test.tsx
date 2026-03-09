import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { RetroButton } from './RetroButton';

describe('<RetroButton />', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar correctamente con el label proporcionado', () => {
    render(<RetroButton label="CLICK ME" onClick={() => {}} />);
    expect(screen.getByText('CLICK ME')).toBeInTheDocument();
  });

  it('debería llamar a onClick cuando se hace clic', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<RetroButton label="ACTION" onClick={onClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('debería mostrarse como activo si la prop isActive es true', () => {
    const { container } = render(<RetroButton label="BTN" isActive={true} onClick={() => {}} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('active');
  });

  it('debería mostrar el tooltip si se proporciona tooltipText y se hace hover', async () => {
    const user = userEvent.setup();
    render(<RetroButton label="BTN" tooltipText="Ayuda" onClick={() => {}} />);
    
    const button = screen.getByRole('button');
    
    // Inicialmente no está (Tooltip render condicional)
    expect(screen.queryByText('Ayuda')).not.toBeInTheDocument();

    await user.hover(button);
    
    expect(screen.getByText('Ayuda')).toBeInTheDocument();
  });
});
