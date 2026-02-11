import './App.css'; 
import { useState } from 'react';
import { synth } from '@/audio/AudioEngine';
import { SynthChassis } from '@/components/layout/SynthChassis';
import { Keyboard } from '@/components/modules/Keyboard';
import { Knob } from '@/components/atoms/Knob';
import { Oscillator } from '@/components/modules/Oscillator';
import { Rack } from './components/layout/Rack/Rack';

function App() {
  
  // 1. LÓGICA (Estado y Audio)
  const [masterVolume, setMasterVolume] = useState(0.3);

  const handleWakeUp = () => {
    synth.initialize();
  };

  const handleVolumeChange = (newVol: number) => {
    setMasterVolume(newVol); 
    synth.setVolume(newVol); 
  };

  // 2. RENDERIZADO (Composición)
  return (
    <SynthChassis
      onWakeUp={handleWakeUp}
      
      // SLOT 1: HEADER
      header={
        <>
          <div className="brand-section">
            <h1 style={{ margin: 0, fontFamily: 'serif', color: '#eecfa1', letterSpacing: '4px' }}>
              SYNTHMIC
            </h1>
            <small style={{ color: '#a1887f', fontFamily: 'monospace' }}>
              The Monster Synth
            </small>
          </div>
          
          <div className="master-controls">
            <Knob 
              label="Master Vol" 
              value={masterVolume} 
              onChange={handleVolumeChange}
              formatTooltip={(v) => Math.round(v * 100) + '%'}
            />
          </div>
        </>
      }

      // SLOT 2: RACK DE MÓDULOS
      rack={
        <Rack>
          <Oscillator />
        </Rack>
             
      }

      // SLOT 3: TECLADO
      keyboard={
        <Keyboard />
      }
    />
  );
}

export default App;