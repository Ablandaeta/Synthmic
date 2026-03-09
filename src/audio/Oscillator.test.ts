import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Oscillator, type Envelope } from "./Oscillator";
import type { LFO } from "./LFO";

describe("Oscillator", () => {
  // mocks y valores por defecto
  let mockCtx: Partial<AudioContext>;
  let mockOutput: Partial<AudioNode>;
  let mockLFO: Partial<LFO>;
  let mockGainNode: Partial<GainNode>;
  let mockOscNode: Partial<OscillatorNode>;
  let testOsc: Oscillator;

  const defaultWaveType: OscillatorType = "sine";
  const defaultFrequency: number = 440;
  const defaultDetune: number = 0;
  const defaultEnvelope: Envelope = {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 0.3,
  };

  beforeEach(() => {
    mockGainNode = {
      connect: vi.fn(),
      gain: {
        value: 0,
        cancelScheduledValues: vi.fn(),
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        setTargetAtTime: vi.fn(),
      } ,
      disconnect: vi.fn(),
    } as unknown as GainNode;

    mockOscNode = {
      connect: vi.fn(),
      frequency: {
        value: 440,
        cancelScheduledValues: vi.fn(),
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        setTargetAtTime: vi.fn(),
      },
      detune: {
        value: 0,
        cancelScheduledValues: vi.fn(),
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        setTargetAtTime: vi.fn(),
      },
      type: "sine",
      start: vi.fn(),
      stop: vi.fn(),
      disconnect: vi.fn(),
    } as unknown as OscillatorNode;

    mockCtx = {
      createGain: vi.fn().mockReturnValue(mockGainNode),
      createOscillator: vi.fn().mockReturnValue(mockOscNode),
      currentTime: 0,
    };
    mockOutput = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
    mockLFO = {
      connect: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  interface OscillatorOverrides {
    waveType?: OscillatorType;
    frequency?: number;
    detune?: number;
    envelope?: Envelope;
  }

  const createOscillator = (overrides: OscillatorOverrides = {}) => {
    return new Oscillator(
      mockCtx as AudioContext,
      overrides.waveType || defaultWaveType,
      overrides.frequency || defaultFrequency,
      overrides.detune || defaultDetune,
      overrides.envelope || defaultEnvelope,
      mockOutput as AudioNode,
      mockLFO as LFO,
    );
  };

  it("Debería configurar las propiedades del oscilador y el gain al nacer", () => {
    createOscillator();

    // Verificamos creación
    expect(mockCtx.createOscillator).toHaveBeenCalledTimes(1);
    expect(mockCtx.createGain).toHaveBeenCalledTimes(1);

    // Verificamos valores iniciales
    expect(mockOscNode.type).toBe(defaultWaveType);
    expect(mockOscNode.frequency?.value).toBe(defaultFrequency);
    expect(mockOscNode.detune?.value).toBe(defaultDetune);
    expect(mockGainNode.gain?.value).toBe(0); 
  });

  it("Debería realizar el cableado (routing) de audio correctamente", () => {
    createOscillator();

    // El orden de la señal: LFO -> Detune | Osc -> Gain -> Output
    expect(mockLFO.connect).toHaveBeenCalledWith(mockOscNode.detune);
    expect(mockOscNode.connect).toHaveBeenCalledWith(mockGainNode);
    expect(mockGainNode.connect).toHaveBeenCalledWith(mockOutput);
  });

  it("Debería arrancar el oscilador inmediatamente", () => {
    createOscillator();
    expect(mockOscNode.start).toHaveBeenCalledTimes(1);
  });

  it("Debería inicializarse con una onda square si se le pasa por parámetro", () => {
    createOscillator({ waveType: "square" });
    expect(mockOscNode.type).toBe("square");
  });

  it("debería calcular y aplicar la envolvente ADSR (Attack, Decay, Sustain) al iniciar", () => {
    createOscillator();
    const now = 0; 
    const safeAttack = Math.max(defaultEnvelope.attack, 0.005);
    const safeDecay = Math.max(defaultEnvelope.decay, 0.005);

    expect(mockGainNode.gain?.cancelScheduledValues).toHaveBeenCalledWith(now);
    expect(mockGainNode.gain?.setValueAtTime).toHaveBeenCalledWith(0, now);

    expect(mockGainNode.gain?.linearRampToValueAtTime).toHaveBeenCalledWith(1, now + safeAttack);
    expect(mockGainNode.gain?.linearRampToValueAtTime).toHaveBeenCalledWith(
      defaultEnvelope.sustain, 
      now + safeAttack + safeDecay
    );
  });

  it("debería hacer un desvanecimiento suave (Release) y limpiar la memoria al detenerse", () => {
    // fake tiempo para controlar los setTimeout
    vi.useFakeTimers();
    testOsc = createOscillator();
    
    const now = 0;
    const safeRelease = Math.max(defaultEnvelope.release, 0.005);

    testOsc.stop();
    expect(mockGainNode.gain?.linearRampToValueAtTime).toHaveBeenCalledWith(0, now + safeRelease);
    expect(mockOscNode.stop).not.toHaveBeenCalled();
    expect(mockOscNode.disconnect).not.toHaveBeenCalled();

    // Avanzamos el reloj artificialmente el tiempo suficiente para que salte el setTimeout
    const tiempoDeEsperaMs = (safeRelease * 2 + 2) * 1000;
    vi.advanceTimersByTime(tiempoDeEsperaMs);

    expect(mockOscNode.stop).toHaveBeenCalledTimes(1);
    expect(mockOscNode.disconnect).toHaveBeenCalledTimes(1);
    expect(mockGainNode.disconnect).toHaveBeenCalledTimes(1);
    // devolvemos el tiempo a la normalidad al final de la prueba
    vi.useRealTimers();
  });

  it("debería actualizar la afinación (detune) suavemente al llamarlo", () => {
    testOsc = createOscillator();    
    // Simulamos que el usuario movió la rueda de Pitch a +200 cents (2 semitonos)
    const nuevosCents = 200;
    testOsc.setDetune(nuevosCents);
    
    expect(mockOscNode.detune?.setTargetAtTime).toHaveBeenCalledWith(
        nuevosCents, 
        mockCtx.currentTime, 
        0.02 
    );
  });
});
