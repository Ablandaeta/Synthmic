import { Oscillator, type Envelope } from './Oscillator';
import { LFO } from './LFO';
import { EQ, type EQBandId, type EQBandParams } from './EQ';
// Extendemos el global Window para incluir webkitAudioContext de Safari
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export class AudioEngine {
  // Contexto de audio
  private ctx: AudioContext;
  // Canal maestro de volumen
  private masterGain: GainNode;
  // Map para guardar los osciladores activos
  private activeOscillators: Map<number, Oscillator> = new Map();
  // Polifonia
  private currentPolyphony: number = 10;
  // Detune
  private currentDetune: number = 0;
  // El tipo de onda actual (sawtooth, sine, square, triangle)
  private currentWaveform: OscillatorType = 'triangle';
  //Estado del Envelope (Valores por defecto)
  private currentEnvelope: Envelope = {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.9,
    release: 0.5,
  };
  private globalLFO: LFO | null = null;
  
  // Instancia del ecualizador
  private eq: EQ;
  
  // Estado actual del EQ (para la UI)
  private currentEQ: Record<EQBandId, EQBandParams> = {
    lowCut: { frequency: 20, Q: 0.707 }, // Roll-off inicial
    band1: { frequency: 100, Q: 1, gain: 0 },
    band2: { frequency: 500, Q: 1, gain: 0 },
    band3: { frequency: 2000, Q: 1, gain: 0 },
    band4: { frequency: 5000, Q: 1, gain: 0 },
    highCut: { frequency: 20000, Q: 0.707 },
  };

  constructor() {
    // Creamos el contexto
    // (Usamos window.AudioContext o webkitAudioContext para compatibilidad con Safari)
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Creamos el canal maestro de volumen
    this.masterGain = this.ctx.createGain();

    // Instanciamos el EQ
    this.eq = new EQ(this.ctx);

    // Conectamos: EQ -> Volumen (masterGain) -> Altavoces (destination)
    this.eq.connectOutput(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Volumen inicial
    this.masterGain.gain.value = 0.3;
  }

  // Los navegadores bloquean el audio hasta que el usuario interactúa.
  // Llamaremos a esto en el primer clic.
  async initialize() {
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if(!this.globalLFO){
      this.globalLFO = new LFO(this.ctx, 'sine', 5);
      this.globalLFO.start();
    }
  }

  // GETTERS
  get waveform() {
    return this.currentWaveform;
  }
  get envelope() {
    return this.currentEnvelope;
  }
  get polyphony() {
    return this.currentPolyphony;
  }
  get detune() {
    return this.currentDetune;
  }
  get volume() {
    return this.masterGain.gain.value;
  }  
  get eqParams() {
    return this.currentEQ;
  }

  // METHODS
  // Método para cambiar el volumen
  setVolume(value: number) {
    // value debe ser entre 0 y 1
    // Usamos setTargetAtTime para que el cambio de volumen sea suave y no brusco
    this.masterGain.gain.setTargetAtTime(value, this.ctx.currentTime, 0.01);
  }

  // Método para cambiar el tipo de onda
  setWaveform(type: OscillatorType) {
    this.currentWaveform = type;
  }

  // Método para cambiar la forma del Envelope
  setEnvelope(params: Partial<Envelope>) {
    // Fusionamos los cambios con los valores actuales
    this.currentEnvelope = { ...this.currentEnvelope, ...params };
  }

  // Método para cambiar la polifonia
  setPolyphony(polyphony: number) {
    this.currentPolyphony = Math.max(1, Math.min(polyphony, 16));
    while (this.activeOscillators.size > this.currentPolyphony) {
      this.stopOldestOscillator();
    }
  }

  // Método para cambiar el detune
  setPitchBend(cents: number) {
    this.currentDetune = cents;
    // Actualizamos todos los osciladores activos inmediatamente
    this.activeOscillators.forEach((osc) => {
      osc.setDetune(cents);
    });
  }

  setModulation(value: number) {
    if (!this.globalLFO) return;

    // Rueda va de 0 a 100. Mapeamos a 0-50 cents de vibrato.
    const depth = (value / 100) * 50; 
    this.globalLFO.setDepth(depth);
  }

  // Método para actualizar una banda del EQ
  setEQBand(bandId: EQBandId, params: Partial<EQBandParams>) {
    // 1. Actualizamos nuestro state interno para la UI
    this.currentEQ[bandId] = { ...this.currentEQ[bandId], ...params };
    
    // 2. Mandamos la señal al procesador de audio real (EQ.ts)
    this.eq.updateBand(bandId, params);
  }

  // Método para tocar una nota
  playTone(frequency: number) {
    // Si ya está sonando, la paramos
    if (this.activeOscillators.has(frequency)) {
      this.activeOscillators.get(frequency)?.stop();
    }
    // Si se supera la polifonia, eliminamos la más vieja
    if (this.activeOscillators.size >= this.polyphony) {
      this.stopOldestOscillator();
    }
    // Creamos un nuevo oscilador
    const newOsc = new Oscillator(
      this.ctx,
      this.currentWaveform,
      frequency,
      this.currentDetune,
      this.currentEnvelope,
      this.eq.preEQGain, // Osc -> Envelope -> EQ
      this.globalLFO || undefined
    );
    this.activeOscillators.set(frequency, newOsc);
  }

  // Método para detener una nota
  stopTone(frequency: number) {
    const osc = this.activeOscillators.get(frequency);
    if (osc) {
      osc.stop();
      this.activeOscillators.delete(frequency);
    }
  }

  private stopOldestOscillator() {
    const firstKey = this.activeOscillators.keys().next().value;
    if (firstKey !== undefined) {
      this.stopTone(firstKey);
    }
  }
}
