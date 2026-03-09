import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { Wheel } from './Wheel';

describe('<Wheel />', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar con el valor inicial y la etiqueta', () => {
    const label = "Pitch Bend";
    render(<Wheel label={label} initialValue={50} onChange={() => {}} />);
    
    expect(screen.getByText(label)).toBeInTheDocument();
    
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.value).toBe("50");
  });

  it('debería llamar a onChange cuando el usuario mueve el slider', () => {
    const onChange = vi.fn();
    render(<Wheel initialValue={0} onChange={onChange} />);
    
    const slider = screen.getByRole('slider');
    
    fireEvent.change(slider, { target: { value: '75' } });
    
    expect(onChange).toHaveBeenCalledWith(75);
    expect((slider as HTMLInputElement).value).toBe("75");
  });

  it('debería volver al centro si isSpringLoaded es true y se suelta el clic', () => {
    const onChange = vi.fn();
    // Centro entre 0 y 100 es 50
    render(<Wheel isSpringLoaded={true} min={0} max={100} initialValue={80} onChange={onChange} />);
    
    const slider = screen.getByRole('slider');
    expect((slider as HTMLInputElement).value).toBe("80");

    // Simulamos movimiento
    fireEvent.change(slider, { target: { value: '90' } });
    expect(onChange).toHaveBeenCalledWith(90);

    // Simulamos soltar el ratón
    fireEvent.mouseUp(slider);
    
    // Debe volver a 50
    expect((slider as HTMLInputElement).value).toBe("50");
    expect(onChange).toHaveBeenCalledWith(50);
  });
});
