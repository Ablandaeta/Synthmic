import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Knob } from './Knob';

describe('<Knob />', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar la etiqueta correctamente', () => {
    const label = "Volumen";
    render(<Knob label={label} value={0.5} onChange={() => {}} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('debería mostrar el tooltip con el porcentaje correcto al hacer hover', async () => {
    const user = userEvent.setup();
    const { container } = render(<Knob value={0.5} min={0} max={1} onChange={() => {}} />);
    
    const socket = container.querySelector('.knob-socket');
    if (!socket) throw new Error('No se encontró el contenedor del Knob');

    // Inicialmente el tooltip no debería estar en el DOM (isShow=false)
    expect(screen.queryByText('50%')).not.toBeInTheDocument();

    // Act: Hover
    await user.hover(socket);
    
    // Assert
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('debería llamar a onChange cuando se arrastra el ratón', () => {
    const onChange = vi.fn();
    // Renderizamos con un valor inicial de 50 en un rango 0-100
    const { container } = render(<Knob value={50} min={0} max={100} onChange={onChange} />);
    
    const eyeball = container.querySelector('.knob-eyeball');
    if (!eyeball) throw new Error('No se encontró el elemento arrastrable');

    // Simular el inicio del arrastre
    fireEvent.mouseDown(eyeball, { clientY: 100 });
    
    // Simular el movimiento del ratón en el window
    // Movimos hacia arriba 50 píxeles. 
    // deltaY = 100 - 50 = 50.
    // deltaValue = (50 / 200) * 100 = 25.
    // newValue = 50 + 25 = 75.
    fireEvent.mouseMove(window, { clientY: 50 }); 
    
    expect(onChange).toHaveBeenCalledWith(75);
    
    fireEvent.mouseUp(window);
  });

  it('debería aplicar el formato personalizado al tooltip', async () => {
    const user = userEvent.setup();
    const formatTooltip = (v: number) => `VAL: ${v}`;
    
    const { container } = render(
      <Knob value={42} formatTooltip={formatTooltip} onChange={() => {}} />
    );
    
    const socket = container.querySelector('.knob-socket');
    if (!socket) throw new Error('Socket no encontrado');

    await user.hover(socket);
    expect(screen.getByText('VAL: 42')).toBeInTheDocument();
  });
});
