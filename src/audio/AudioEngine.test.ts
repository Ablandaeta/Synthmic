import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";

import { AudioEngine } from "./AudioEngine";
import { Oscillator } from "./Oscillator";
import { LFO } from "./LFO";
import { EQ } from "./EQ";

// Mock de las clases satélite
vi.mock("./Oscillator", () => {
  return {
    Oscillator: vi.fn().mockImplementation(function() {
      return {
        stop: vi.fn(),
        setDetune: vi.fn(),
        glideFrequency: vi.fn(),
      };
    }),
  };
});

vi.mock("./LFO", () => {
  return {
    LFO: vi.fn().mockImplementation(function() {
      return {
        start: vi.fn(),
        setDepth: vi.fn(),
      };
    }),
  };
});

vi.mock("./EQ", () => {
  return {
    EQ: vi.fn().mockImplementation(function() {
      return {
        preEQGain: {}, // dummy sub-node for Osc injection
        connectInput: vi.fn(),
        connectOutput: vi.fn(),
        updateBand: vi.fn(),
      };
    }),
  };
});

describe("AudioEngine", () => {
  // Declaración de Mocks y Typings en lo alto
  let mockCtx: Partial<AudioContext>;
  let mockMasterGain: Partial<GainNode>;
  let testEngine: AudioEngine;

  interface MockGlobals {
    window?: typeof globalThis;
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  }

  beforeEach(() => {
    // Inicializamos los nodos/métodos falsos
    mockMasterGain = {
      connect: vi.fn(),
      gain: {
        value: 0,
        setTargetAtTime: vi.fn(),
      } as unknown as AudioParam,
    };

    mockCtx = {
      state: "suspended",
      resume: vi.fn().mockResolvedValue(undefined),
      createGain: vi.fn().mockReturnValue(mockMasterGain),
      destination: {} as AudioDestinationNode,
      currentTime: 0,
    };

    // Inyectamos nuestro Contexto falso en el entorno global de Node
    const g = globalThis as unknown as MockGlobals;
    g.window = globalThis;
    g.AudioContext = vi.fn().mockImplementation(function() { return mockCtx; });
    g.webkitAudioContext = vi.fn().mockImplementation(function() { return mockCtx; });
  });

  afterEach(() => {
    vi.clearAllMocks();
    const g = globalThis as unknown as MockGlobals;
    delete g.window;
    delete g.AudioContext;
    delete g.webkitAudioContext;
  });

  // Patrón de Instanciación
  const createAudioEngine = () => {
    return new AudioEngine();
  };

  describe("Inicialización y Construcción", () => {
    it("debería instanciar el AudioContext y el canal maestro (masterGain) correctamente al crearse", () => {
      testEngine = createAudioEngine();

      expect(window.AudioContext).toHaveBeenCalledTimes(1);
      expect(mockCtx.createGain).toHaveBeenCalledTimes(1);
      expect(EQ).toHaveBeenCalledTimes(1);
      
      // Routing interno modificado: EQ -> MasterGain -> Destination
      const eqMock = (EQ as unknown as Mock).mock.results[0].value;
      expect(eqMock.connectOutput).toHaveBeenCalledWith(mockMasterGain);
      expect(mockMasterGain.connect).toHaveBeenCalledWith(mockCtx.destination);
    });

    it("debería tener las propiedades y valores por defecto definidos (Caja Negra mediante getters)", () => {
      testEngine = createAudioEngine();

      expect(testEngine.volume).toBe(0.3);
      expect(mockMasterGain.gain?.value).toBe(0.3); // Comprobando el mock interno indirectamente

      expect(testEngine.waveform).toBe("triangle");
      expect(testEngine.polyphony).toBe(10);
      expect(testEngine.detune).toBe(0);
      expect(testEngine.envelope).toEqual({
        attack: 0.01,
        decay: 0.1,
        sustain: 0.9,
        release: 0.5,
      });
    });
  });

  describe("Routing y Arranque (initialize)", () => {
    it("initialize() debería reanudar el AudioContext si estaba suspendido y arrancar el LFO", async () => {
      testEngine = createAudioEngine();
      await testEngine.initialize();

      expect(mockCtx.resume).toHaveBeenCalledTimes(1);
      
      expect(LFO).toHaveBeenCalledWith(mockCtx, "sine", 5);
      
      const mockLfoInstance = (LFO as unknown as Mock).mock.results[0].value;
      expect(mockLfoInstance.start).toHaveBeenCalledTimes(1);
    });
  });

  describe("Setters y Controles de Estado", () => {
    beforeEach(() => {
      testEngine = createAudioEngine();
    });

    it("setVolume() debería llamar setTargetAtTime para un escalado suave en el masterGain", () => {
      testEngine.setVolume(0.8);
      expect(mockMasterGain.gain?.setTargetAtTime).toHaveBeenCalledWith(
        0.8,
        mockCtx.currentTime,
        0.01
      );
    });

    it("setWaveform() debería alterar la forma de onda devuelta desde su getter", () => {
      testEngine.setWaveform("square");
      expect(testEngine.waveform).toBe("square");
    });

    it("setEnvelope() debería hacer un escaneo parcial (merge) y conservar propiedades base", () => {
      testEngine.setEnvelope({ release: 2.5, attack: 0.8 });
      expect(testEngine.envelope.release).toBe(2.5);
      expect(testEngine.envelope.attack).toBe(0.8);
      expect(testEngine.envelope.decay).toBe(0.1); 
      expect(testEngine.envelope.sustain).toBe(0.9); 
    });

    it("setPitchBend() debería propagar el nuevo detune a todos los osciladores activos de inmediato", () => {
      testEngine.playTone(440);
      testEngine.playTone(880);

      testEngine.setPitchBend(200);

      expect(testEngine.detune).toBe(200);

      const oscMock1 = (Oscillator as unknown as Mock).mock.results[0].value;
      const oscMock2 = (Oscillator as unknown as Mock).mock.results[1].value;

      expect(oscMock1.setDetune).toHaveBeenCalledWith(200);
      expect(oscMock2.setDetune).toHaveBeenCalledWith(200);
    });

    it("setModulation() debería setear proporcionalmente el LFO de 0 a 50 de rango en base al input (0 a 100)", async () => {
      await testEngine.initialize(); 

      testEngine.setModulation(100);

      const mockLfoInstance = (LFO as unknown as Mock).mock.results[0].value;
      expect(mockLfoInstance.setDepth).toHaveBeenCalledWith(50);
    });
    
    it("setModulation() no debería explotar en error si globalLFO falla y no ha sido instanciado", () => {
        expect(() => testEngine.setModulation(50)).not.toThrow();
    });

    it("setGlissando() debería guardar el valor y clamp entre 0-1", () => {
      testEngine.setGlissando(0.5);
      expect(testEngine.glissando).toBe(0.5);

      testEngine.setGlissando(1.5);
      expect(testEngine.glissando).toBe(1);

      testEngine.setGlissando(-0.5);
      expect(testEngine.glissando).toBe(0);
    });

    it("setEQBand() debería guardar la configuración en la UI state y mandársela al procesador de audio EQ", () => {
      testEngine.setEQBand('band1', { frequency: 500, gain: 2.5 });

      // Verificando que state de UI interno mutó y devolvió a la lectura
      expect(testEngine.eqParams.band1.frequency).toBe(500);
      expect(testEngine.eqParams.band1.gain).toBe(2.5);

      // Verificando llamada de sub-capa (Caja Negra mock)
      const eqMock = (EQ as unknown as Mock).mock.results[0].value;
      expect(eqMock.updateBand).toHaveBeenCalledWith('band1', { frequency: 500, gain: 2.5 });
    });
  });

  describe("Control de Notas y Polifonía", () => {
    beforeEach(() => {
      testEngine = createAudioEngine();
    });

    it("playTone() debería inicializar y registrar la asignación del oscilador con las propiedades actuales y enviarlo al EQ", () => {
      testEngine.playTone(200);
      
      const eqMock = (EQ as unknown as Mock).mock.results[0].value;

      expect(Oscillator).toHaveBeenCalledWith(
        mockCtx,
        testEngine.waveform,
        200,
        testEngine.detune,
        testEngine.envelope,
        eqMock.preEQGain, // Conectado directo al EQ
        undefined 
      );
    });

    it("playTone() debería detener un oscilador en la misma frecuencia, si ya existía antes", () => {
      testEngine.playTone(300);
      const primerOscMock = (Oscillator as unknown as Mock).mock.results[0].value;
      
      testEngine.playTone(300); 
      
      expect(primerOscMock.stop).toHaveBeenCalledTimes(1);
      expect(Oscillator).toHaveBeenCalledTimes(2); 
    });

    it("playTone() debería respetar la polifonía por defecto eliminando silenciosamente la nota más antigua", () => {
      testEngine.setPolyphony(2);
      
      testEngine.playTone(100);
      testEngine.playTone(200);

      const oscViejo = (Oscillator as unknown as Mock).mock.results[0].value;
      
      testEngine.playTone(300);

      expect(oscViejo.stop).toHaveBeenCalledTimes(1);
    });

    it("setPolyphony() debería detener gradualmente múltiples notas viejas si se restringe agresivamente el límite", () => {
      testEngine.playTone(1);
      testEngine.playTone(2);
      testEngine.playTone(3);

      const oscMock1 = (Oscillator as unknown as Mock).mock.results[0].value;
      const oscMock2 = (Oscillator as unknown as Mock).mock.results[1].value;

      testEngine.setPolyphony(1);

      expect(testEngine.polyphony).toBe(1);
      expect(oscMock1.stop).toHaveBeenCalledTimes(1); 
      expect(oscMock2.stop).toHaveBeenCalledTimes(1);
    });

    it("stopTone() debería invocar stop de forma explícita en su clase hija Oscillator", () => {
      testEngine.playTone(1000);
      const miOscMock = (Oscillator as unknown as Mock).mock.results[0].value;
      
      testEngine.stopTone(1000);
      
      expect(miOscMock.stop).toHaveBeenCalledTimes(1);
    });

    it("playTone() con polyphony=1 y glissando>0 debería hacer glide sin crear nuevo oscilador", () => {
      testEngine.setPolyphony(1);
      testEngine.setGlissando(0.5);
      const oscCountBefore = (Oscillator as unknown as Mock).mock.results.length;

      testEngine.playTone(440);

      const firstOsc = (Oscillator as unknown as Mock).mock.results[oscCountBefore]?.value;

      testEngine.playTone(880);

      expect(Oscillator).toHaveBeenCalledTimes(oscCountBefore + 1);
      expect(firstOsc.glideFrequency).toHaveBeenCalledWith(880, 1);
    });

    it("stopTone() con la frecuencia anterior no debería detener el oscilador después de un glide", () => {
      testEngine.setPolyphony(1);
      testEngine.setGlissando(0.5);
      testEngine.playTone(262);
      const oscMock = (Oscillator as unknown as Mock).mock.results[0].value;

      testEngine.playTone(330); // glide from 262 to 330

      // Simulate releasing original key - should NOT stop the oscillator
      testEngine.stopTone(262);

      // The oscillator should NOT have been stopped
      expect(oscMock.stop).not.toHaveBeenCalled();
    });

    it("playTone() con polyphony>1 debería ignorar glissando", () => {
      testEngine.setPolyphony(4);
      testEngine.setGlissando(0.5);
      const oscCountBefore = (Oscillator as unknown as Mock).mock.results.length;

      testEngine.playTone(440);
      testEngine.playTone(880);

      expect(Oscillator).toHaveBeenCalledTimes(oscCountBefore + 2);
    });

    it("debería encadenar glissando en 3+ notas sin reiniciarse", () => {
      testEngine.setPolyphony(1);
      testEngine.setGlissando(0.5);

      testEngine.playTone(262); // C4
      testEngine.playTone(330); // E4 - glide from 262
      testEngine.stopTone(262); // release C4 (re-keyed, should be no-op)

      // mono tracking should still be intact → 3rd note glides
      testEngine.playTone(392); // G4 - should glide from 330

      // Oscillator constructor should only have been called once (first note)
      expect(Oscillator).toHaveBeenCalledTimes(1);
    });
  });
});
