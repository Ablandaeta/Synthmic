import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LFO } from "./LFO";

describe("LFO", () => {
  // Mocks y valores por defecto
  let mockCtx: Partial<AudioContext>;
  let mockOscNode: Partial<OscillatorNode>;
  let mockDepthGainNode: Partial<GainNode>;
  let mockOutputParam: Partial<AudioParam>;

  let testLFO: LFO;

  const defaultWaveType: OscillatorType = "sine";
  const defaultFrequency: number = 5;

  beforeEach(() => {
    // 1. Construcción: Mocks de Nodos
    mockOscNode = {
      type: "sine",
      frequency: { value: 0 } as AudioParam,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    } as unknown as OscillatorNode;

    mockDepthGainNode = {
      gain: { value: 0 } as AudioParam,
      connect: vi.fn(),
    } as unknown as GainNode;

    // 2. Inyección de contexto
    mockCtx = {
      createOscillator: vi.fn().mockReturnValue(mockOscNode),
      createGain: vi.fn().mockReturnValue(mockDepthGainNode),
    };

    mockOutputParam = {} as unknown as AudioParam;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // 3. Patrón de Instanciación
  interface LFOOverrides {
    waveType?: OscillatorType;
    frequency?: number;
  }

  const createLFO = (overrides: LFOOverrides = {}) => {
    return new LFO(
      mockCtx as AudioContext,
      overrides.waveType || defaultWaveType,
      overrides.frequency || defaultFrequency
    );
  };

  describe("Inicialización", () => {
    it("debería crear los nodos requeridos y configurarlos con valores por defecto al instanciarse", () => {
      createLFO();

      // Verificamos creación
      expect(mockCtx.createOscillator).toHaveBeenCalledTimes(1);
      expect(mockCtx.createGain).toHaveBeenCalledTimes(1);

      // Verificamos valores iniciales
      expect(mockOscNode.type).toBe(defaultWaveType);
      expect(mockOscNode.frequency?.value).toBe(defaultFrequency);
      expect(mockDepthGainNode.gain?.value).toBe(0);
    });

    it("debería sobreescribir los valores por defecto si se pasan parámetros en el constructor", () => {
      createLFO({ waveType: "square", frequency: 10 });

      expect(mockOscNode.type).toBe("square");
      expect(mockOscNode.frequency?.value).toBe(10);
    });
  });

  describe("Routing / Cableado", () => {
    it("debería conectar el oscilador interno a su nodo de ganancia de profundidad (depthGain)", () => {
      createLFO();
      
      expect(mockOscNode.connect).toHaveBeenCalledWith(mockDepthGainNode);
    });
  });

  describe("Métodos", () => {
    beforeEach(() => {
      testLFO = createLFO();
    });

    it("start() debería arrancar el oscilador interno", () => {
      testLFO.start();
      expect(mockOscNode.start).toHaveBeenCalledTimes(1);
    });

    it("stop() debería detener el oscilador interno", () => {
      testLFO.stop();
      expect(mockOscNode.stop).toHaveBeenCalledTimes(1);
    });

    it("connect() debería conectar el nodo de control gain (depthGain) al AudioParam de destino", () => {
      testLFO.connect(mockOutputParam as AudioParam);
      expect(mockDepthGainNode.connect).toHaveBeenCalledWith(mockOutputParam);
    });

    it("setDepth() debería actualizar el valor de la ganancia que controla la amplitud del LFO", () => {
      testLFO.setDepth(25);
      expect(mockDepthGainNode.gain?.value).toBe(25);
    });

    it("setRate() debería actualizar la frecuencia de oscilación", () => {
      testLFO.setRate(12);
      expect(mockOscNode.frequency?.value).toBe(12);
    });

    it("setWaveType() debería actualizar el tipo de onda del LFO", () => {
      testLFO.setWaveType("sawtooth");
      expect(mockOscNode.type).toBe("sawtooth");
    });
  });
});
