import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { EnvelopeControl } from "./EnvelopeControl";

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockSynth = {
  polyphony: 8,
  envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.5 },
  setPolyphony: vi.fn(),
  setEnvelope: vi.fn(),
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

  // TEST 5 — GLISSANDO es UI-only: NO llama a ningún método del backend
  it("no debería llamar a ningún método del synth al interactuar con GLISSANDO", async () => {
    render(<EnvelopeControl />);

    const glissandoKnob = screen.getByLabelText("GLISSANDO");

    await act(async () => {
      fireEvent.mouseDown(glissandoKnob);
    });

    // GLISSANDO es solo UI — no hay backend todavía
    expect(mockSynth.setPolyphony).not.toHaveBeenCalled();
    expect(mockSynth.setEnvelope).not.toHaveBeenCalled();
  });
});
