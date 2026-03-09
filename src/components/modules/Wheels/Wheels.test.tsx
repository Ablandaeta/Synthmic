import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Wheels } from "./Wheels";

const mockSynth = {
  setPitchBend: vi.fn(),
  setModulation: vi.fn(),
};

vi.mock("@/hooks", () => ({
  useSynth: () => mockSynth,
}));

describe("<Wheels />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar las dos ruedas (Pitch y Mod)", () => {
    render(<Wheels />);
    expect(screen.getByText("PITCH")).toBeInTheDocument();
    expect(screen.getByText("MOD")).toBeInTheDocument();
  });

  it("debería llamar a setPitchBend cuando se mueve la rueda de Pitch", () => {
    render(<Wheels />);
    const pitchSlider = screen.getAllByRole("slider")[0]; // Pitch es la primera
    
    fireEvent.change(pitchSlider, { target: { value: "100" } });
    expect(mockSynth.setPitchBend).toHaveBeenCalledWith(100);
  });

  it("debería llamar a setModulation cuando se mueve la rueda de Modulación", () => {
    render(<Wheels />);
    const modSlider = screen.getAllByRole("slider")[1]; // Mod es la segunda
    
    fireEvent.change(modSlider, { target: { value: "50" } });
    expect(mockSynth.setModulation).toHaveBeenCalledWith(50);
  });
});
