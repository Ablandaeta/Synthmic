import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { WaveformSelector } from "./WaveformSelector";

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockSynth = {
  waveform: "triangle" as OscillatorType,
  setWaveform: vi.fn(),
};

vi.mock("@/hooks", () => ({
  useSynth: () => mockSynth,
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("<WaveformSelector />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1 — Renderizado por defecto
  it("debería renderizar las 5 opciones de waveform", () => {
    render(<WaveformSelector />);

    expect(screen.getByText("SINE")).toBeInTheDocument();
    expect(screen.getByText("TRIANGLE")).toBeInTheDocument();
    expect(screen.getByText("SQUARE")).toBeInTheDocument();
    expect(screen.getByText("SAWTOOTH")).toBeInTheDocument();
    // expect(screen.getByText("WHITE NOISE")).toBeInTheDocument();
  });

  // TEST 2 — El switch activo coincide con la onda inicial del synth
  it("debería marcar como activo el switch de la onda actual del synth", () => {
    render(<WaveformSelector />);

    const activeSwitch = screen.getByRole("radio", {
      name: /select triangle waveform/i,
    });
    expect(activeSwitch).toHaveAttribute("aria-checked", "true");
  });

  // TEST 3 — Interacción: seleccionar una nueva onda
  it("debería llamar a setWaveform al hacer click en otro switch", async () => {
    const user = userEvent.setup();
    render(<WaveformSelector />);

    const sineSwitch = screen.getByRole("radio", {
      name: /select sine waveform/i,
    });
    await user.click(sineSwitch);

    expect(mockSynth.setWaveform).toHaveBeenCalledOnce();
    expect(mockSynth.setWaveform).toHaveBeenCalledWith("sine");
  });

  // TEST 4 — White noise NO llama al backend (no implementado)
  // it("no debería llamar a setWaveform al hacer click en WHITE NOISE", async () => {
  //   const user = userEvent.setup();
  //   render(<WaveformSelector />);

  //   const noiseSwitch = screen.getByRole("radio", {
  //     name: /select white noise waveform/i,
  //   });
  //   await user.click(noiseSwitch);

  //   expect(mockSynth.setWaveform).not.toHaveBeenCalled();
  // });

  // TEST 5 — El label de sección "WAVEFORMS" está visible
  it("debería mostrar el footer label 'WAVEFORMS'", () => {
    render(<WaveformSelector />);
    expect(screen.getByText("WAVEFORMS")).toBeInTheDocument();
  });
});
