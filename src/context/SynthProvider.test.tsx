import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SynthProvider } from './SynthProvider';
import { useSynth } from '@/hooks/useSynth';

// Mock de AudioEngine para evitar que intente crear un AudioContext real en el test
vi.mock('@/audio/AudioEngine', () => {
  return {
    AudioEngine: vi.fn().mockImplementation(function() {
      return {
        waveform: 'triangle',
        envelope: { attack: 0.1, decay: 0.1, sustain: 1, release: 0.5 },
        initialize: vi.fn(),
        playTone: vi.fn(),
        stopTone: vi.fn(),
      };
    }),
  };
});

// Componente de prueba para verificar el acceso al contexto
const TestComponent = () => {
  const synth = useSynth();
  return <div data-testid="synth-value">{synth.waveform}</div>;
};

describe('<SynthProvider />', () => {
  it('debería proveer la instancia del motor de audio a sus hijos', () => {
    render(
      <SynthProvider>
        <TestComponent />
      </SynthProvider>
    );

    const element = screen.getByTestId('synth-value');
    expect(element.textContent).toBe('triangle');
  });

  it('debería lanzar un error si useSynth se usa fuera del proveedor', () => {
    // Silenciamos el error de consola esperado por React al fallar el renderizado
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useSynth debe usarse dentro de un SynthProvider'
    );

    consoleSpy.mockRestore();
  });
});
