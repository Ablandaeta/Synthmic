import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Keyboard } from "./Keyboard";

// Mocks
const mockSynth = {
  playTone: vi.fn(),
  stopTone: vi.fn(),
};

// Guardamos las referencias a los callbacks del teclado para dispararlos manualmente
let keyPressCallback: ((key: string) => void) | undefined;
let keyReleaseCallback: ((key: string) => void) | undefined;

vi.mock("@/hooks", () => ({
  useSynth: () => mockSynth,
  useKeyboard: (onPress: (key: string) => void, onRelease: (key: string) => void) => {
    keyPressCallback = onPress;
    keyReleaseCallback = onRelease;
  },
  useHover: () => ({
    isHovered: false,
    hoverHandlers: { onMouseEnter: vi.fn(), onMouseLeave: vi.fn() }
  }),
  useDragControl: () => ({
    isDragging: false,
    handleMouseDown: vi.fn()
  }),
}));

// Mock de data para evitar depender de la octava real
vi.mock("@/data/note", () => ({
  getOctaveNotes: (octave: number) => [
    { note: "C", freq: 261.63 * Math.pow(2, octave - 4), isBlack: false },
    { note: "C#", freq: 277.18 * Math.pow(2, octave - 4), isBlack: true },
    { note: "D", freq: 293.66 * Math.pow(2, octave - 4), isBlack: false },
  ],
  COMPUTER_KEY_MAP: { a: 0, w: 1, s: 2 },
}));

describe("<Keyboard />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar las teclas correctas para una octava específica", () => {
    render(<Keyboard octave={5} />);
    // C y D son blancas, C# es negra
    const keys = screen.getAllByRole("button");
    expect(keys).toHaveLength(3);
    // Verificamos frecuencia en aria-label (octava 5 es 2x octava 4)
    expect(screen.getByLabelText(/frecuencia 523.26/i)).toBeInTheDocument();
  });

  it("debería llamar a playTone cuando se pulsa una tecla visual", async () => {
    render(<Keyboard />);
    const cKey = screen.getByLabelText(/Tecla C,/i);
    
    // Usamos act para envolver eventos que causan cambios de estado complejos
    await act(async () => {
      fireEvent.mouseDown(cKey);
    });
    expect(mockSynth.playTone).toHaveBeenCalledWith(261.63);
    
    await act(async () => {
      fireEvent.mouseUp(cKey);
    });
    expect(mockSynth.stopTone).toHaveBeenCalledWith(261.63);
  });

  it("debería responder a eventos del teclado de la computadora", async () => {
    render(<Keyboard />);
    
    // Disparamos el callback que el hook useKeyboard habría registrado
    if (keyPressCallback) {
        const onPress = keyPressCallback;
        await act(async () => {
          onPress("a"); // "a" mapea al indice 0 -> Nota C
        });
        expect(mockSynth.playTone).toHaveBeenCalledWith(261.63);
    }
    
    if (keyReleaseCallback) {
        const onRelease = keyReleaseCallback;
        await act(async () => {
          onRelease("a");
        });
        expect(mockSynth.stopTone).toHaveBeenCalledWith(261.63);
    }
  });

  it("debería resaltar visualmente la tecla cuando está activa", async () => {
    render(<Keyboard />);
    const cKey = screen.getByLabelText(/Tecla C,/i);
    
    // Antes de pulsar no debe tener clase pressed
    expect(cKey).not.toHaveClass("pressed");

    await act(async () => {
      fireEvent.mouseDown(cKey);
    });
    expect(cKey).toHaveClass("pressed");
  });
});
