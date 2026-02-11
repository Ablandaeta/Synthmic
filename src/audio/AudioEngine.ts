// Extendemos el global Window para incluir webkitAudioContext de Safari
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export class AudioEngine {
  // El contexto es el "estudio virtual" donde ocurre todo
  private ctx: AudioContext;
  
  // El control de volumen maestro (siempre conectado a los altavoces)
  private masterGain: GainNode;
  
  // El oscilador actual (la cuerda vocal del monstruo)
  private oscillator: OscillatorNode | null = null;
  
  // El tipo de onda actual (sawtooth, sine, square, triangle) por defecto es 'sawtooth'
  private currentWaveform: OscillatorType = 'sawtooth';

  constructor() {
    // 1. Creamos el contexto
    // (Usamos window.AudioContext o webkitAudioContext para compatibilidad con Safari)
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // 2. Creamos el canal maestro de volumen
    this.masterGain = this.ctx.createGain();
    
    // 3. Conectamos: Volumen -> Altavoces
    this.masterGain.connect(this.ctx.destination);
    
    // Volumen inicial 
    this.masterGain.gain.value = 0.3; // 30% para no romper los oídos al principio
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
    // Si ya está sonando una nota, podríamos cambiarla en vivo (opcional),
    // pero por ahora basta con guardar el dato para la PRÓXIMA nota.
  }

  playTone(frequency: number) {
    // 1. Si ya hay una nota sonando, la detenemos suavemente antes de la nueva
    this.stopTone();

    // 2. Creamos un nuevo oscilador
    this.oscillator = this.ctx.createOscillator();
    
    // 3. Configuramos sus cuerdas vocales
    this.oscillator.type = this.currentWaveform; // Usamos el tipo de onda actual
    this.oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    // 4. Conectamos: Oscilador -> Volumen Maestro
    this.oscillator.connect(this.masterGain);

    // 5. ¡GRITA!
    this.oscillator.start();
  }

  stopTone() {
    if (this.oscillator) {
      // Detenemos el oscilador
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
  }
}

// Exportamos UNA sola instancia (Singleton) para toda la app.
// Así, no importa cuántas teclas toques, todas usan el mismo "cerebro".
export const synth = new AudioEngine();