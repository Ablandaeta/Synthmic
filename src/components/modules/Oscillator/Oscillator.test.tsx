import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Oscillator } from "./Oscillator";

// Mock del hook useSynth
const mockSynth = {
  waveform: "triangle" as OscillatorType,
  envelope: {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 0.3,
  },
  setWaveform: vi.fn(),
  setEnvelope: vi.fn(),
};

vi.mock("@/hooks", () => ({
  useSynth: () => mockSynth,
  useHover: () => ({
    isHovered: false,
    hoverHandlers: { onMouseEnter: vi.fn(), onMouseLeave: vi.fn() }
  }),
  useDragControl: ({ onChange, value }: { onChange: (v: number) => void; value: number }) => ({
    isDragging: false,
    handleMouseDown: () => onChange(value + 0.1) // Simular pequeño movimiento
  }),
}));

// Mock de Tooltip para evitar problemas con hooks internos si los tuviera
vi.mock("@/components/atoms/Tooltip", () => ({
  Tooltip: () => null,
}));

describe("<Oscillator />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar con los valores iniciales del synth", () => {
    render(<Oscillator />);
    
    // Verificamos que la pantalla muestra el tipo de onda inicial
    expect(screen.getByText(/TRIANGLE/i)).toBeInTheDocument();
  });

  it("debería cambiar la forma de onda al pulsar los botones", async () => {
    const user = userEvent.setup();
    render(<Oscillator />);

    // Buscamos el botón de onda cuadrada (label "∏")
    const squareBtn = screen.getByText("∏");
    await user.click(squareBtn);

    expect(mockSynth.setWaveform).toHaveBeenCalledWith("square");
    expect(screen.getByText(/SQUARE/i)).toBeInTheDocument();
  });

  it("debería actualizar el envelope al mover los los controles ADSR", async () => {
    render(<Oscillator />);
    
    // Obtenemos el Knob por su etiqueta de accesibilidad "A" (Attack)
    const attackKnob = screen.getByLabelText("A");

    await act(async () => {
        fireEvent.mouseDown(attackKnob);
    });

    expect(mockSynth.setEnvelope).toHaveBeenCalled();
    // Verificamos que se llamó con un objeto que tiene la propiedad attack actualizada
    const calls = mockSynth.setEnvelope.mock.calls;
    expect(calls[0][0]).toHaveProperty("attack");
    expect(calls[0][0].attack).toBeCloseTo(0.2); // 0.1 inicial + 0.1 del mock
  });
});
