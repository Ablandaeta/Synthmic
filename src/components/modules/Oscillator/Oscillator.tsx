import './Oscillator.css';
import { useState } from 'react';
import { synth } from '@/audio/AudioEngine';
import { RetroButton } from '@/components/atoms/RetroButton/RetroButton';
import { RetroDisplay } from '@/components/atoms/RetroDisplay/RetroDisplay';

// Tipos de onda permitidos por Web Audio API
type WaveType = 'sawtooth' | 'sine' | 'square' | 'triangle';

const WAVE_BTNS: Array<{ type: WaveType; label: string; tooltip: string }> = [
  { type: 'sine', label: '~', tooltip: 'Sine Wave' },
  { type: 'square', label: '∏', tooltip: 'Square Wave' },
  { type: 'sawtooth', label: 'N', tooltip: 'Sawtooth Wave' },
  { type: 'triangle', label: 'Λ', tooltip: 'Triangle Wave' },
];

export const Oscillator = () => {
  const [selectedWave, setSelectedWave] = useState<WaveType>('sawtooth');

  const handleWaveChange = (wave: WaveType) => {
    setSelectedWave(wave);
    synth.setWaveform(wave); // Comunicamos al motor de audio
  };

  return (
    <div className="oscillator-panel">
      {/* La Pantalla Retro del dibujo */}
      <RetroDisplay label="OSC-1">
         <span style={{ textTransform: 'uppercase', fontSize: '12px' }}>
            {selectedWave}
         </span>
         {/* Aquí podríamos poner un icono SVG de la onda más adelante */}
      </RetroDisplay>

      {/* Los Botones Selectores */}
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
    </div>
  );
};