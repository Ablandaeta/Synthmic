import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EQ } from './EQ';

// Mocks de la Web Audio API
class MockAudioParam {
  value: number = 0;
  setTargetAtTime = vi.fn();
  setValueAtTime = vi.fn();
}

class MockAudioNode {
  connect = vi.fn();
  disconnect = vi.fn();
}

class MockBiquadFilterNode extends MockAudioNode {
  type: string = 'peaking';
  frequency = new MockAudioParam();
  Q = new MockAudioParam();
  gain = new MockAudioParam();
}

class MockGainNode extends MockAudioNode {
  gain = new MockAudioParam();
}

// Simulamos el AudioContext para observar la creación de los nodos
class MockAudioContext {
  createBiquadFilter = vi.fn().mockImplementation(() => new MockBiquadFilterNode());
  createGain = vi.fn().mockImplementation(() => new MockGainNode());
  currentTime: number = 0;
}

describe('EQ (Ecualizador)', () => {
  let mockCtx: AudioContext;

  beforeEach(() => {
    mockCtx = new MockAudioContext() as unknown as AudioContext;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Instanciación y Ruteo', () => {
    it('debe instanciar correctamente la cantidad exacta de nodos (2 Gain, 6 Filtros)', () => {
      new EQ(mockCtx);
      
      expect(mockCtx.createGain).toHaveBeenCalledTimes(2); // input, output
      expect(mockCtx.createBiquadFilter).toHaveBeenCalledTimes(6); // 6 bandas
    });

    it('debe asignar los tipos correctos (highpass, lowpass, peaking) a cada filtro', () => {
      const eq = new EQ(mockCtx);
      
      // Low Cut corta frecuencias bajas y deja pasar las altas => highpass
      expect(eq.lowCut.type).toBe('highpass');
      
      // High Cut corta frecuencias altas y deja pasar bajas => lowpass
      expect(eq.highCut.type).toBe('lowpass');
      
      // Las 4 bandas restantes deben ser campanas paramétricas => peaking
      expect(eq.band1.type).toBe('peaking');
      expect(eq.band2.type).toBe('peaking');
      expect(eq.band3.type).toBe('peaking');
      expect(eq.band4.type).toBe('peaking');
    });

    it('debe encadenar correctamente Input -> LowCut -> B1 -> B2 -> B3 -> B4 -> HighCut -> Output', () => {
      const eq = new EQ(mockCtx);

      // Verificamos el ruteo interno
      expect(eq.preEQGain.connect).toHaveBeenCalledWith(eq.lowCut);
      expect(eq.lowCut.connect).toHaveBeenCalledWith(eq.band1);
      expect(eq.band1.connect).toHaveBeenCalledWith(eq.band2);
      expect(eq.band2.connect).toHaveBeenCalledWith(eq.band3);
      expect(eq.band3.connect).toHaveBeenCalledWith(eq.band4);
      expect(eq.band4.connect).toHaveBeenCalledWith(eq.highCut);
      expect(eq.highCut.connect).toHaveBeenCalledWith(eq.outputGain);
    });
  });

  describe('Control de Parámetros', () => {
    it('debe actualizar los valores de una banda específica correctamente y sin clicks (setTargetAtTime)', () => {
      const eq = new EQ(mockCtx);
      
      eq.updateBand('band2', { frequency: 1200, Q: 1.5, gain: 2.5 });

      // Debe llamar a setTargetAtTime y no asignar abruptamente para proteger los oídos.
      expect(eq.band2.frequency.setTargetAtTime).toHaveBeenCalledWith(1200, mockCtx.currentTime, 0.05);
      expect(eq.band2.Q.setTargetAtTime).toHaveBeenCalledWith(1.5, mockCtx.currentTime, 0.05);
      expect(eq.band2.gain.setTargetAtTime).toHaveBeenCalledWith(2.5, mockCtx.currentTime, 0.05);
    });

    it('debe omitir actualizar Gain si la banda es lowCut o highCut y no recibe valor', () => {
      const eq = new EQ(mockCtx);
      
      eq.updateBand('lowCut', { frequency: 40, Q: 0.707 });

      expect(eq.lowCut.frequency.setTargetAtTime).toHaveBeenCalled();
      expect(eq.lowCut.Q.setTargetAtTime).toHaveBeenCalled();
      // No debería haber tocado la ganancia
      expect(eq.lowCut.gain.setTargetAtTime).not.toHaveBeenCalled();
    });
  });
});
