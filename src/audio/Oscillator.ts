export interface Envelope {
  attack: number;  // Tiempo en segundos (0.005 a 2s)
  decay: number;   // Tiempo en segundos (0.005 a 2s)
  sustain: number; // Nivel de volumen (0.1 a 1)
  release: number; // Tiempo en segundos (0.005 a 5s)
}
export class Oscillator {
    private ctx: AudioContext;
    private envelope: Envelope;
    private osc: OscillatorNode;
    private envGain: GainNode;
    // private easing: number = 0.005;

constructor(AudioContext: AudioContext, WaveType: OscillatorType, Frequency: number, Detune: number, Envelope: Envelope, Output: AudioNode) {
        this.ctx = AudioContext;
        this.envelope = Envelope //|| {
        //     attack: 0.005, 
        //     decay: 0.1, 
        //     sustain: 0.5, 
        //     release: 0.1
        // };

        // Crear el oscilador
        this.osc = AudioContext.createOscillator();
        this.osc.frequency.value = Frequency;
        this.osc.detune.value = Detune;
        this.osc.type = WaveType;

        // Crear el control de volumen del oscilador para el envelope
        this.envGain = AudioContext.createGain();
        this.envGain.gain.value = 0;

        // Conectar el oscilador al "envelope"Gain y este a la salida
        this.osc.connect(this.envGain);
        this.envGain.connect(Output);

        // Iniciar el oscilador y el envelope
        this.osc.start();
        this.start();

    }
    // Metodo para iniciar la fase de Attack, Decay y Sustain
    start(){
        const now = this.ctx.currentTime;
        const { attack, decay, sustain } = this.envelope;
        this.envGain.gain.cancelScheduledValues(now);
        this.envGain.gain.setValueAtTime(0, now);
        // Attack
        const safeAttack = Math.max(attack, 0.005);
        this.envGain.gain.linearRampToValueAtTime(1, now + safeAttack);
        // Decay y Sustain
        const safeDecay = Math.max(decay, 0.005);
        this.envGain.gain.linearRampToValueAtTime(sustain, now + safeAttack + safeDecay);        
    }

    // Metodo para detener y la fase de Release
    stop(){
        const now = this.ctx.currentTime;
        console.log("now", now);
        
        const { release } = this.envelope;
        const currentGain = this.envGain.gain.value;

        this.envGain.gain.cancelScheduledValues(now);
        this.envGain.gain.setValueAtTime(currentGain, now);

        const safeRelease = Math.max(release, 0.005);
        this.envGain.gain.linearRampToValueAtTime(0, now + safeRelease );

        setTimeout(() => {
            this.osc.stop();
            this.osc.disconnect();
            this.envGain.disconnect();
            console.log("Oscillator stopped", this.ctx.currentTime, this.ctx.currentTime - now);
        }, (safeRelease * 2 + 2) *1000); 
    }
    
}