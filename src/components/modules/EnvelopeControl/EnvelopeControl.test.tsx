import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { EnvelopeControl } from "./EnvelopeControl";

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockSynth = {
  polyphony: 8,
  envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.5 },
  setPolyphony: vi.fn(),
  setEnvelope: vi.fn(),
  setGlissando: vi.fn(),
};

vi.mock("@/hooks", () => ({
  useSynth: () => mockSynth,
  useHover: () => ({
    isHovered: false,
    hoverHandlers: { onMouseEnter: vi.fn(), onMouseLeave: vi.fn() },
  }),
  useDragControl: ({
    onChange,
    value,
  }: {
    onChange: (v: number) => void;
    value: number;
  }) => ({
    isDragging: false,
    handleMouseDown: () => onChange(value + 0.1),
  }),
}));

vi.mock("@/components/atoms/Tooltip", () => ({
  Tooltip: () => null,
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("<EnvelopeControl />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1 — Renderizado: todas las secciones visibles
  it("debería renderizar las etiquetas POLYPHONY, GLISSANDO y los 4 knobs ADSR", () => {
    render(<EnvelopeControl />);

    expect(screen.getByText("POLYPHONY")).toBeInTheDocument();
    expect(screen.getByText("GLISSANDO")).toBeInTheDocument();
    expect(screen.getByLabelText("ATTACK")).toBeInTheDocument();
    expect(screen.getByLabelText("DECAY")).toBeInTheDocument();
    expect(screen.getByLabelText("SUSTAIN")).toBeInTheDocument();
    expect(screen.getByLabelText("RELEASE")).toBeInTheDocument();
  });

  // TEST 2 — Footer label visible
  it("debería mostrar el footer label 'ENVELOPE'", () => {
    render(<EnvelopeControl />);
    expect(screen.getByText("ENVELOPE")).toBeInTheDocument();
  });

  // TEST 3 — Interacción: cambio de polyphony llama al backend
  it("debería llamar a setPolyphony al interactuar con el knob POLYPHONY", async () => {
    render(<EnvelopeControl />);

    const polyphonyKnob = screen.getByLabelText("POLYPHONY");

    await act(async () => {
      fireEvent.mouseDown(polyphonyKnob);
    });

    expect(mockSynth.setPolyphony).toHaveBeenCalled();
  });

  // TEST 4 — Interacción: cambio de envelope llama al backend
  it("debería llamar a setEnvelope al interactuar con el knob ATTACK", async () => {
    render(<EnvelopeControl />);

    const attackKnob = screen.getByLabelText("ATTACK");

    await act(async () => {
      fireEvent.mouseDown(attackKnob);
    });

    expect(mockSynth.setEnvelope).toHaveBeenCalled();
    const call = mockSynth.setEnvelope.mock.calls[0][0];
    expect(call).toHaveProperty("attack");
  });

  // TEST 5 — GLISSANDO llama a setGlissando del backend
  it("debería llamar a setGlissando del synth al interactuar con el knob GLISSANDO", async () => {
    render(<EnvelopeControl />);

    const glissandoKnob = screen.getByLabelText("GLISSANDO");

    await act(async () => {
      fireEvent.mouseDown(glissandoKnob);
    });

    expect(mockSynth.setGlissando).toHaveBeenCalled();
  });

  // TEST 6 — GLISSANDO deshabilitado cuando polyphony !== 1
  it("debería deshabilitar el knob GLISSANDO cuando polyphony !== 1", () => {
    const { container } = render(<EnvelopeControl />);

    const disabledSockets = container.querySelectorAll('.knob-socket--disabled');
    expect(disabledSockets.length).toBeGreaterThanOrEqual(1);
  });

  // TEST 7 — Resetea glissando al cambiar de mono a poli
  it("debería resetear glissando a 0 cuando polyphony cambia a > 1", async () => {
    render(<EnvelopeControl />);

    const glissandoKnob = screen.getByLabelText("GLISSANDO");
    const polyphonyKnob = screen.getByLabelText("POLYPHONY");

    // Primera interacción con GLISSANDO: 0 → 0.1
    await act(async () => {
      fireEvent.mouseDown(glissandoKnob);
    });
    expect(mockSynth.setGlissando).toHaveBeenCalledWith(0.1);

    vi.clearAllMocks();

    // Interacción con POLYPHONY: rounded=8, !==1, resetea glissando a 0
    await act(async () => {
      fireEvent.mouseDown(polyphonyKnob);
    });

    // Segunda interacción con GLISSANDO: debe empezar desde 0 otra vez
    await act(async () => {
      fireEvent.mouseDown(glissandoKnob);
    });

    // Si se reseteó, es 0.1; de lo contrario sería 0.2
    expect(mockSynth.setGlissando).toHaveBeenCalledWith(0.1);
  });
});
