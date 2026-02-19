import './Oscillator.css';
import { useState } from 'react';
import { synth } from '@/audio/AudioEngine';
import { RetroButton } from '@/components/atoms/RetroButton/RetroButton';
import { RetroDisplay } from '@/components/atoms/RetroDisplay/RetroDisplay';
import { Knob } from '@/components/atoms/Knob/Knob';

// Tipos de onda permitidos por Web Audio API
type WaveType = 'sawtooth' | 'sine' | 'square' | 'triangle';
type ADSRKey = 'a'|'d'|'s'|'r';

const WAVE_BTNS: Array<{ type: WaveType; label: string; tooltip: string }> = [
  { type: 'sine', label: '~', tooltip: 'Sine Wave' },
  { type: 'square', label: '∏', tooltip: 'Square Wave' },
  { type: 'sawtooth', label: 'N', tooltip: 'Sawtooth Wave' },
  { type: 'triangle', label: 'Λ', tooltip: 'Triangle Wave' },
];

const ADSR_CONFIG: Array<{ min: number; max: number; label: string; key: ADSRKey }> = [
  { min: 0.01, max: 2, label: 'A', key: 'a' },
  { min: 0.01, max: 2, label: 'D', key: 'd' },
  { min: 0.01, max: 1, label: 'S', key: 's' },
  { min: 0.01, max: 2, label: 'R', key: 'r' },
];

export const Oscillator = () => {
  const [selectedWave, setSelectedWave] = useState<WaveType>('sawtooth');

  const [adsr, setAdsr] = useState({ a: 0.01, d: 0.1, s: 0.5, r: 0.5 });

  const handleWaveChange = (wave: WaveType) => {
    setSelectedWave(wave);
    synth.setWaveform(wave); // Comunicamos al motor de audio
  };

  const updateAdsr = (key: ADSRKey, val: number) => {
    const newAdsr = { ...adsr, [key]: val };
    setAdsr(newAdsr);
    
    // Mapeamos las letras a los nombres reales del engine
    synth.setEnvelope({
        attack: newAdsr.a,
        decay: newAdsr.d,
        sustain: newAdsr.s,
        release: newAdsr.r
    });
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
      <div className="wave-selectors">
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
      <div className="adsr-section">
        {ADSR_CONFIG.map(({min, max, label, key}) => (
            <Knob 
            label={label}
            min={min}
            max={max}
            value={adsr[key]}
            onChange={(v) => updateAdsr(key, v)}
            formatTooltip={label !== 'S' ? (v) => `${v.toFixed(2)}s` : undefined}
            size={25}
        />
       ))}
      </div>
    </div>
  );
};