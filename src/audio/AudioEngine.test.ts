import { describe, test, expect, beforeEach, vi } from "vitest";

import { AudioEngine } from "./AudioEngine";
import { Oscillator } from "./Oscillator";

// SIMULACIÓN (MOCK) DE DEPENDENCIAS USANDO "vi"
// Evitamos que intente crear sonido real mockeando la clase Oscillator
vi.mock("./Oscillator", () => {
  return {
    Oscillator: vi.fn().mockImplementation(function () {
      return {
        stop: vi.fn(), // Simulamos el método stop
      };
    }),
  };
});

describe("AudioEngine", () => {
  let engine: AudioEngine;
  // Usamos 'as unknown as' para decirle a TypeScript que estos objetos parciales
  // son mocks válidos de las interfaces completas de la Web Audio API
  let mockAudioContext: AudioContext;
  let mockGainNode: GainNode;

  beforeEach(() => {
    // Limpiamos los registros de las simulaciones antes de cada prueba
    vi.clearAllMocks();

    // SIMULACIÓN DE LA WEB AUDIO API
    // Creamos un nodo de ganancia (volumen) falso
    mockGainNode = {
      connect: vi.fn(),
      gain: {
        value: 0, // El AudioEngine escribirá 0.3 aquí en el constructor
        setTargetAtTime: vi.fn(),
      },
    } as unknown as GainNode; // GainNode tiene ~50 props; casteamos el mock parcial

    // Creamos un AudioContext falso
    mockAudioContext = {
      state: "suspended",
      resume: vi.fn().mockResolvedValue(undefined),
      createGain: vi.fn().mockReturnValue(mockGainNode),
      destination: {},
      currentTime: 0,
    } as unknown as AudioContext; // AudioContext tiene ~50 props; casteamos el mock parcial

    // Inyectamos nuestro Contexto falso en el objeto global "window"
    vi.stubGlobal(
      "AudioContext",
      vi.fn().mockImplementation(function () {
        return mockAudioContext;
      }),
    );

    // INSTANCIAMOS EL MOTOR (antes de cada test)
    engine = new AudioEngine();
  });

  // PRUEBAS DE ESTADO INICIAL
  test("debe inicializarse con los valores por defecto correctos", () => {
    expect(engine.volume).toBe(0.3);
    expect(engine.waveform).toBe("triangle");
    expect(engine.polyphony).toBe(10);
    expect(engine.envelope).toEqual({
      attack: 0.01,
      decay: 0.1,
      sustain: 0.9,
      release: 0.5,
    });
  });

  // PRUEBAS DE MÉTODOS
  test("debe despertar el AudioContext al llamar a initialize()", async () => {
    await engine.initialize();
    expect(mockAudioContext.resume).toHaveBeenCalled();
  });

  test("debe actualizar el volumen correctamente usando setTargetAtTime", () => {
    engine.setVolume(0.5);
    // Verificamos que se llamó a la función de suavizado de audio de la API
    expect(mockGainNode.gain.setTargetAtTime).toHaveBeenCalledWith(
      0.5,
      0,
      0.01,
    );
  });

  test("debe actualizar la forma de onda (waveform)", () => {
    engine.setWaveform("square");
    expect(engine.waveform).toBe("square");
  });

  test("debe actualizar el envelope de forma parcial sin borrar lo demás", () => {
    engine.setEnvelope({ attack: 0.8 }); // Solo cambiamos el attack
    expect(engine.envelope.attack).toBe(0.8);
    expect(engine.envelope.decay).toBe(0.1); // El decay original se mantiene
  });

  // PRUEBA DE LÓGICA DE POLIFONÍA
  test("debe respetar la polifonía máxima y detener la nota más antigua", () => {
    engine.setPolyphony(2); // Reducimos el máximo a 2 notas para probar fácil

    engine.playTone(440); // Nota 1
    engine.playTone(880); // Nota 2
    engine.playTone(1760); // Nota 3 - ¡Al tocar esta, la Nota 1 (440) debería detenerse!

    // Obtenemos la "instancia" simulada del primer oscilador que se creó
    // Usamos el tipado de Vitest para inferir el mock
    const primerOsciladorMock = vi.mocked(Oscillator).mock.results[0].value;

    // Verificamos que su método "stop" haya sido ejecutado
    expect(primerOsciladorMock.stop).toHaveBeenCalled();
  });
});
