export interface EQBandParams {
  frequency: number;
  Q: number;
  gain?: number;
}

export type EQBandId = 'lowCut' | 'band1' | 'band2' | 'band3' | 'band4' | 'highCut';

export type EQConfig = Record<EQBandId, EQBandParams>;

export class EQ {
  // Estos nodos serán instanciados en el constructor y usados para el audio
  public readonly preEQGain: GainNode;
  public readonly lowCut: BiquadFilterNode;
  public readonly band1: BiquadFilterNode;
  public readonly band2: BiquadFilterNode;
  public readonly band3: BiquadFilterNode;
  public readonly band4: BiquadFilterNode;
  public readonly highCut: BiquadFilterNode;
  public readonly outputGain: GainNode;
  
  private ctx: AudioContext;

  constructor(ctx: AudioContext) {
    this.ctx = ctx;

    // Crear nodos de ganancia
    this.preEQGain = ctx.createGain();
    this.outputGain = ctx.createGain();

    // Crear filtros Biquad
    this.lowCut = ctx.createBiquadFilter();
    this.band1 = ctx.createBiquadFilter();
    this.band2 = ctx.createBiquadFilter();
    this.band3 = ctx.createBiquadFilter();
    this.band4 = ctx.createBiquadFilter();
    this.highCut = ctx.createBiquadFilter();
    
    // Configurar tipos de filtros
    this.lowCut.type = 'highpass';
    this.band1.type = 'peaking';
    this.band2.type = 'peaking';
    this.band3.type = 'peaking';
    this.band4.type = 'peaking';
    this.highCut.type = 'lowpass';

    // Ruteo en serie: Input -> LowCut -> B1 -> B2 -> B3 -> B4 -> HighCut -> Output
    this.preEQGain.connect(this.lowCut);
    this.lowCut.connect(this.band1);
    this.band1.connect(this.band2);
    this.band2.connect(this.band3);
    this.band3.connect(this.band4);
    this.band4.connect(this.highCut);
    this.highCut.connect(this.outputGain);
  }

  public connectInput(source: AudioNode): void {
    source.connect(this.preEQGain);
  }

  public connectOutput(destination: AudioNode): void {
    this.outputGain.connect(destination);
  }

  public updateBand(bandId: EQBandId, params: Partial<EQBandParams>): void {
    const node = this[bandId] as BiquadFilterNode;
    const time = this.ctx.currentTime;
    const timeConstant = 0.05; // Evita el click al suavizar los cambios

    if (params.frequency !== undefined) {
      node.frequency.setTargetAtTime(params.frequency, time, timeConstant);
    }

    if (params.Q !== undefined) {
      node.Q.setTargetAtTime(params.Q, time, timeConstant);
    }

    // Highpass y Lowpass no usan 'gain' de la misma forma que peaking, omitimos su uso.
    if (params.gain !== undefined && bandId !== 'lowCut' && bandId !== 'highCut') {
      node.gain.setTargetAtTime(params.gain, time, timeConstant);
    }
  }
}
