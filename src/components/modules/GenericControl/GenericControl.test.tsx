import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { GenericControl } from "./GenericControl";

// GenericControl es prop-based — NO necesita mock de useSynth

vi.mock("@/hooks", () => ({
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

describe("<GenericControl />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1 — Renderizado: muestra el knob y el label de sección
  it("debería renderizar el knob con su label y el sectionLabel del módulo", () => {
    render(
      <GenericControl
        label="POLYPHONY"
        moduleLabel="POLYPHONY"
        min={1}
        max={16}
        value={8}
        onChange={vi.fn()}
      />
    );

    // El knob atom renderiza el label como aria-label
    expect(screen.getByLabelText("POLYPHONY")).toBeInTheDocument();
    // El sectionLabel puede aparecer también en el knob-label → usamos getAllByText
    const matches = screen.getAllByText("POLYPHONY");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  // TEST 2 — Callback: llama a onChange con el nuevo valor al interactuar
  it("debería llamar a onChange al interactuar con el knob", async () => {
    const handleChange = vi.fn();
    render(
      <GenericControl
        label="GLISSANDO"
        moduleLabel="GLISSANDO"
        min={0}
        max={1}
        value={0.5}
        onChange={handleChange}
      />
    );

    const knob = screen.getByLabelText("GLISSANDO");

    await act(async () => {
      fireEvent.mouseDown(knob);
    });

    expect(handleChange).toHaveBeenCalledOnce();
    expect(handleChange).toHaveBeenCalledWith(expect.any(Number));
  });

  // TEST 3 — sectionLabel es opcional: si no se pasa, no aparece el footer
  it("debería funcionar sin sectionLabel (solo el knob)", () => {
    render(
      <GenericControl label="VOL" min={0} max={1} value={0.5} onChange={vi.fn()} />
    );
    expect(screen.getByLabelText("VOL")).toBeInTheDocument();
  });
});
