export class LFO {
  private ctx: AudioContext;
  private lfo: OscillatorNode;
  private depthGain: GainNode;

  constructor(ctx: AudioContext, waveType: OscillatorType = 'sine', frequency: number = 5) {
    this.ctx = ctx;
    // Crear el oscilador
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = waveType;
    this.lfo.frequency.value = frequency;
    // Crear el control de volumen del oscilador para el envelope
    this.depthGain = this.ctx.createGain();
    this.depthGain.gain.value = 0;
    // Conectar el oscilador a su gain
    this.lfo.connect(this.depthGain);    
  }
  start() {
    this.lfo.start();
  }
  stop() {
    this.lfo.stop();
  }
  connect(output: AudioParam) {
    this.depthGain.connect(output);
  }

  setDepth(value: number) {
    this.depthGain.gain.value = value;
  }
  setRate(value: number) {
    this.lfo.frequency.value = value;
  }
  setWaveType(waveType: OscillatorType) {
    this.lfo.type = waveType;
  }
  
}