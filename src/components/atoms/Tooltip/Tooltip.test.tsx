import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './Tooltip'; 

describe('Componente Tooltip', () => {
  
  it('no renderiza nada en el HTML si isShow es false', () => {
    // Renderizamos el componente "apagado"
    const { container } = render(<Tooltip text="Prueba" isShow={false} />);
    
    // Comprobamos que el contenedor está vacío
    expect(container.firstChild).toBeNull();
  });

  it('renderiza el texto correctamente si isShow es true', () => {
    // Renderizamos el componente "encendido"
    render(<Tooltip text="Volumen 50%" isShow={true} />);
    
    // Buscamos el texto en la pantalla falsa
    const elemento = screen.getByText('Volumen 50%');
    
    // Comprobamos que existe
    expect(elemento).toBeInTheDocument();
  });

});