import { Oscillator, type Envelope } from './Oscillator';
// Extendemos el global Window para incluir webkitAudioContext de Safari
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export class AudioEngine {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private activeOscillator: Oscillator | null = null;

  // El tipo de onda actual (sawtooth, sine, square, triangle) por defecto es 'sawtooth'
  private currentWaveform: OscillatorType = 'sawtooth';
  //Estado del Envelope (Valores por defecto)
  private envelope: Envelope = {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5, 
    release: 0.5  
  };

  constructor() {
    // Creamos el contexto
    // (Usamos window.AudioContext o webkitAudioContext para compatibilidad con Safari)
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Creamos el canal maestro de volumen
    this.masterGain = this.ctx.createGain();
    
    // Conectamos: Volumen -> Altavoces
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
  }

  setVolume(value: number) {
    // value debe ser entre 0 y 1
    // Usamos setTargetAtTime para que el cambio de volumen sea suave y no brusco
    this.masterGain.gain.setTargetAtTime(value, this.ctx.currentTime, 0.01);
  }
  
  // cambia el tipo de onda 
  setWaveform(type: OscillatorType) {
    this.currentWaveform = type;    
  }

  // Método para cambiar la forma del Envelope
  setEnvelope(params: Partial<Envelope>) {
    // Fusionamos los cambios con los valores por defecto
    this.envelope = { ...this.envelope, ...params };
  }

  playTone(frequency: number) {
    if (this.activeOscillator) {
      this.activeOscillator.stop();
    }
    this.activeOscillator = new Oscillator(this.ctx, this.currentWaveform, frequency, 0, this.envelope, this.masterGain);
    
  }

  stopTone() {
    if (this.activeOscillator) {
      this.activeOscillator.stop();
      this.activeOscillator = null;
    }
  }
}

// Exportamos UNA sola instancia (Singleton) para toda la app.
// Así, no importa cuántas teclas toques, todas usan el mismo "cerebro".
export const synth = new AudioEngine();