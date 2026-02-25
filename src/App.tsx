import './App.css'; 
import { useState } from 'react';
import { useSynth } from '@/hooks';
import { SynthChassis } from '@/components/layout/SynthChassis';
import { Keyboard } from '@/components/modules/Keyboard';
import { Knob } from '@/components/atoms/Knob';
import { Oscillator } from '@/components/modules/Oscillator';
import { Rack } from '@/components/layout/Rack/Rack';
import { Wheels } from '@/components/modules/Wheels';

function App() {  
  // LÓGICA (Estado y Audio)
  const synth = useSynth();
  const [masterVolume, setMasterVolume] = useState(synth.volume);

  const handleWakeUp = () => {
    synth.initialize();
  };

  const handleVolumeChange = (newVol: number) => {
    setMasterVolume(newVol); 
    synth.setVolume(newVol); 
  };

  // RENDERIZADO (Composición)
  return (
    <SynthChassis
      onWakeUp={handleWakeUp}
      
      // SLOT 1: HEADER
      header={
        <>
          <div className="brand-section">
            <h1>
              SYNTHMIC
            </h1>
            <small>
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
        <>

        <Wheels />
        <Keyboard />
        </>
      }
    />
  );
}

export default App;