import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { EqModule } from "./EqModule";

const mockSetEQBand = vi.fn();
const mockSynthContext = {
  eqParams: {
    lowCut: { frequency: 20, Q: 0.707 },
    band1: { frequency: 100, Q: 1.5, gain: 0 },
    band2: { frequency: 500, Q: 1.5, gain: 2 },
    band3: { frequency: 2000, Q: 1.5, gain: 0 },
    band4: { frequency: 5000, Q: 1.5, gain: 0 },
    highCut: { frequency: 20000, Q: 0.707 },
  },
  setEQBand: mockSetEQBand,
};

// Mock del hook useSynth, y hooks de tooltip/drag para el Knob
vi.mock("@/hooks", () => ({
  useSynth: () => mockSynthContext,
  useHover: () => ({
    isHovered: false,
    hoverHandlers: { onMouseEnter: vi.fn(), onMouseLeave: vi.fn() },
  }),
  useDragControl: ({ onChange, value }: { onChange: (v: number) => void; value: number }) => ({
    isDragging: false,
    // simulamos drag interaction aumentando el valor en 5 unidades 
    // pero si es el selector lo incrementamos 1 nomás
    handleMouseDown: () => {
      onChange(value === 1 ? 2 : value + 5);
    }, 
  }),
}));

vi.mock("@/components/atoms/Tooltip", () => ({
  Tooltip: () => null,
}));

describe("<EqModule />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería renderizar la estructura principal del EQ (Filters, Band Select, Active Band)", () => {
    render(<EqModule />);
    expect(screen.getByText("HIGH PASS")).toBeInTheDocument();
    expect(screen.getByText("LOW PASS")).toBeInTheDocument();
    expect(screen.getByText("BAND SELECT")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE BAND PARAMETERS")).toBeInTheDocument();
  });

  it("debería iniciar con la banda 1 seleccionada y mostrar sus valores correctos", () => {
    render(<EqModule />);
    // La banda 1 del mock tiene Freq 100
    // Hay múltiples knobs "FREQ". El 0 es HPF, el 1 es LPF, el 2 es Active Band Parameters.
    const freqs = screen.getAllByLabelText("FREQ");
    const activeBandFreqKnob = freqs[2];
    
    act(() => {
      fireEvent.mouseDown(activeBandFreqKnob);
    });
    // Validamos que partió de 100 (band1) -> 105
    expect(mockSetEQBand).toHaveBeenCalledWith("band1", { frequency: 105 });
  });

  it("debería cambiar la banda que se edita al girar el selector, delegando cambios a la nueva banda", () => {
    render(<EqModule />);
    
    // El selector empieza en 1. Sumarlo lo pasará a 2.
    // El Knob selector en la nueva UI no tiene label visual. Usar query por el role o testid, o aria-label? 
    // Lo buscaremos por "BAND" o algo, o dejaremos que tenga label "" pero con area-label "BAND 1..4". 
    // Por simplicidad, le daremos aria-label="Band Selector" (pasaremos role si lo soporta el Knob, pero el Knob usa label para visual y aria. 
    // Si pasamos label="" el text es empty. Pero probaremos con un label invisible vía child, o con Tooltip).
    // Para simplificar, le voy a pasar label="BAND" y ocultarlo visualmente si es necesario, o buscar por otro criterio.
    // Asumamos que el label visual es "BAND".
    const selectKnob = screen.getByLabelText("BAND SELECTOR");
    act(() => {
      fireEvent.mouseDown(selectKnob); 
    });
    
    const freqs = screen.getAllByLabelText("FREQ");
    const activeBandFreqKnob = freqs[2];
    act(() => {
      fireEvent.mouseDown(activeBandFreqKnob);
    });
    // Validar que se mandó a 'band2'
    expect(mockSetEQBand).toHaveBeenCalledWith("band2", { frequency: 505 });
  });

  it("debería llamar a setEQBand correctamente para el High Pass Filter", () => {
    render(<EqModule />);
    const hpfFreqKnob = screen.getAllByLabelText("FREQ")[0];
    act(() => { fireEvent.mouseDown(hpfFreqKnob); });
    expect(mockSetEQBand).toHaveBeenCalledWith("lowCut", { frequency: 25 });
  });

  it("debería llamar a setEQBand correctamente para el Low Pass Filter", () => {
    render(<EqModule />);
    const lpfFreqKnob = screen.getAllByLabelText("FREQ")[1];
    act(() => { fireEvent.mouseDown(lpfFreqKnob); });
    expect(mockSetEQBand).toHaveBeenCalledWith("highCut", { frequency: 20005 });
  });

  it("debería llamar a setEQBand correctamente para parámetros Width(Q) y Gain activos", () => {
    render(<EqModule />);
    // El Q[0] es HPF, Q[1] es LPF, Q[2] es Active Band
    const activeBandQKnob = screen.getAllByLabelText("Q")[2]; 
    act(() => { fireEvent.mouseDown(activeBandQKnob); });
    expect(mockSetEQBand).toHaveBeenCalledWith("band1", { Q: 6.5 }); // q=1.5 + 5 = 6.5

    const activeBandGainKnob = screen.getByLabelText("GAIN"); 
    act(() => { fireEvent.mouseDown(activeBandGainKnob); });
    expect(mockSetEQBand).toHaveBeenCalledWith("band1", { gain: 5 }); // gain=0 + 5 = 5
  });
});
