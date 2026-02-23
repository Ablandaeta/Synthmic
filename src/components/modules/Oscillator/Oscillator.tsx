import './Oscillator.css';
import { useState } from 'react';
import { useSynth } from '@/hooks';

import { RetroButton } from '@/components/atoms/RetroButton/RetroButton';
import { RetroDisplay } from '@/components/atoms/RetroDisplay/RetroDisplay';
import { Knob } from '@/components/atoms/Knob/Knob';

import { type Envelope } from '@/audio/Oscillator';

const WAVE_BTNS: Array<{ type: OscillatorType; label: string; tooltip: string }> = [
  { type: 'sine', label: '~', tooltip: 'Sine Wave' },
  { type: 'square', label: '∏', tooltip: 'Square Wave' },
  { type: 'sawtooth', label: 'N', tooltip: 'Sawtooth Wave' },
  { type: 'triangle', label: 'Λ', tooltip: 'Triangle Wave' },
];

const ADSR_CONFIG: Array<{ min: number; max: number; label: string; key: keyof Envelope }> = [
  { min: 0.01, max: 2, label: 'A', key: 'attack' },
  { min: 0.01, max: 2, label: 'D', key: 'decay' },
  { min: 0.01, max: 1, label: 'S', key: 'sustain' },
  { min: 0.01, max: 2, label: 'R', key: 'release' },
];

export const Oscillator = () => {
  const synth = useSynth();
  const [selectedWave, setSelectedWave] = useState<OscillatorType>(synth.waveform);

  const [envelope, setEnvelope] = useState<Envelope>(synth.envelope);
  const [polyphony, setPolyphony] = useState<number>(synth.polyphony);

  const handleWaveChange = (wave: OscillatorType) => {
    setSelectedWave(wave);
    synth.setWaveform(wave); // Comunicamos al motor de audio
  };

  const updateEnvelope = (key: keyof Envelope, val: number) => {
    const newEnvelope = { ...envelope, [key]: val };
    setEnvelope(newEnvelope);
    
    // Mapeamos las letras a los nombres reales del engine
    synth.setEnvelope({
        attack: newEnvelope.attack,
        decay: newEnvelope.decay,
        sustain: newEnvelope.sustain,
        release: newEnvelope.release
    });
  };

  const updatePolyphony = (polyphony: number) => {
    setPolyphony(polyphony);
    synth.setPolyphony(polyphony);
  };

  return (
    <div className="oscillator-panel">
      {/* PANTALLA SUPERIOR */}
      <RetroDisplay label="OSC-1">
         <span style={{ textTransform: 'uppercase', fontSize: '12px' }}>
            {selectedWave}
         </span>
         {/* Aquí podríamos poner un icono SVG de la onda más adelante */}
      </RetroDisplay>

      {/* SELECTORES DE ONDA */}
      <div className="oscillator-section">
        {WAVE_BTNS.map(({ type, label, tooltip }) => (
            <RetroButton 
                key={type}
                label={label}
                isActive={selectedWave === type}
                onClick={() => handleWaveChange(type)}
                tooltipText={tooltip}
            />
        ))}
      </div>

      {/* CONTROLES DE ENVELOPE (ADSR) */}
      <div className="oscillator-section">
        {ADSR_CONFIG.map(({min, max, label, key}) => (
            <Knob 
            label={label}
            min={min}
            max={max}
            value={envelope[key]}
            onChange={(v) => updateEnvelope(key, v)}
            formatTooltip={label !== 'S' ? (v) => `${v.toFixed(2)}s` : undefined}
            size={25}
        />
       ))}
      </div>

      <div className="oscillator-section">
        <Knob 
            label="Poly"
            min={1}
            max={16}
            value={polyphony}
            onChange={(v) => updatePolyphony(v)}
            formatTooltip={(v) => `${Math.round(v)} voices`}
            size={25}
        />
      </div>
    </div>
  );
};