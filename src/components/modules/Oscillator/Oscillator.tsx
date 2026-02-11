import { useState } from 'react';
import { synth } from '@/audio/AudioEngine';
import './Oscillator.css';

// Tipos de onda permitidos por Web Audio API
type WaveType = 'sawtooth' | 'sine' | 'square' | 'triangle';

export default function Oscillator() {
  const [selectedWave, setSelectedWave] = useState<WaveType>('sawtooth');

  const handleWaveChange = (wave: WaveType) => {
    setSelectedWave(wave);
    synth.setWaveform(wave); // Comunicamos al motor de audio
  };

  return (
    <div className="oscillator-panel">
      {/* La Pantalla Retro del dibujo */}
      <div className="wave-display">
        <div className="screen-glass">
            <span className="wave-name">{selectedWave}</span>
            {/* Aquí podríamos dibujar la onda con SVG más tarde */}
            <div className={`visual-wave ${selectedWave}`}></div>
        </div>
      </div>

      {/* Los Botones Selectores */}
      <div className="wave-selectors">
        <button 
            className={selectedWave === 'sine' ? 'active' : ''} 
            onClick={() => handleWaveChange('sine')}
            title="Sine (Suave)"
        >~</button>
        
        <button 
            className={selectedWave === 'square' ? 'active' : ''} 
            onClick={() => handleWaveChange('square')}
            title="Square (8-bit)"
        >∏</button>
        
        <button 
            className={selectedWave === 'sawtooth' ? 'active' : ''} 
            onClick={() => handleWaveChange('sawtooth')}
            title="Sawtooth (Agresiva)"
        >N</button>
        
        <button 
            className={selectedWave === 'triangle' ? 'active' : ''} 
            onClick={() => handleWaveChange('triangle')}
            title="Triangle (Dulce)"
        >Λ</button>
      </div>
    </div>
  );
};