import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Key } from './Key';

describe('<Key />', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    note: "C4",
    frequency: 261.63,
    onPress: vi.fn(),
    onRelease: vi.fn(),
  };

  it('debería renderizar la tecla con el aria-label correcto', () => {
    render(<Key {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Tecla C4, frecuencia 261.63 Hz');
  });

  it('debería añadir la clase "black" si isBlack es true', () => {
    render(<Key {...defaultProps} isBlack={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('black');
  });

  it('debería llamar a onPress al hacer click (mouseDown)', () => {
    render(<Key {...defaultProps} />);
    const button = screen.getByRole('button');
    
    fireEvent.mouseDown(button);
    
    expect(defaultProps.onPress).toHaveBeenCalledWith(defaultProps.frequency);
    expect(button).toHaveClass('pressed');
  });

  it('debería llamar a onRelease al soltar el ratón (mouseUp)', () => {
    render(<Key {...defaultProps} />);
    const button = screen.getByRole('button');
    
    fireEvent.mouseDown(button);
    fireEvent.mouseUp(button);
    
    expect(defaultProps.onRelease).toHaveBeenCalledWith(defaultProps.frequency);
    expect(button).not.toHaveClass('pressed');
  });

  it('debería añadir la clase "pressed" si isActive es true (vía teclado PC)', () => {
    render(<Key {...defaultProps} isActive={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('pressed');
  });

  it('debería mostrar el tooltip de la nota al hacer hover', async () => {
    const user = userEvent.setup();
    render(<Key {...defaultProps} />);
    
    const button = screen.getByRole('button');
    
    // Inicialmente oculto (Tooltip usa renders condicionales)
    expect(screen.queryByText('C4')).not.toBeInTheDocument();

    await user.hover(button);
    
    expect(screen.getByText('C4')).toBeInTheDocument();
  });

  it('debería activar la nota si se entra en la tecla con el botón del ratón pulsado', () => {
    render(<Key {...defaultProps} />);
    const button = screen.getByRole('button');
    
    // Simulamos entrar en la tecla con el botón izquierdo (1) pulsado
    fireEvent.mouseEnter(button, { buttons: 1 });
    
    expect(defaultProps.onPress).toHaveBeenCalledWith(defaultProps.frequency);
    expect(button).toHaveClass('pressed');
  });
});
