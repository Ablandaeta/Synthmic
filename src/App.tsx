import './App.css'
import { useState } from 'react';
import { synth } from './audio/AudioEngine'; // Importamos la instancia
import { Keyboard } from '@/components/modules/Keyboard';
import { Knob } from '@/components/atoms/Knob';
import { Oscillator } from './components/modules/Oscillator';

function App() {
  
  // Función para despertar el audio context si está dormido
  const handleWakeUp = () => {
    synth.initialize();
  };

  const [masterVolume, setMasterVolume] = useState(0.3);

  const handleVolumeChange = (newVol: number) => {
    setMasterVolume(newVol); // Actualiza el Ojo visualmente
    synth.setVolume(newVol); // Actualiza el Audio real
  };

  return (
    // Agregamos onMouseDown aquí para asegurar que el audio arranque al primer toque
    <div className="synth-container" onMouseDown={handleWakeUp} onTouchStart={handleWakeUp}>
      {/* HEADER DEL SINTE */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px',
        borderBottom: '4px solid #1a110d',
        marginBottom: '20px',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div>
          <h1 style={{ fontFamily: 'serif', letterSpacing: '5px', margin: 0 }}>SYNTHMIC</h1>
          <small style={{ color: '#888' }}>The Monster Synth</small>
        </div>

        {/* Aquí vive el Ojo Maestro */}
        <Knob 
          label="Master Vol" 
          value={masterVolume} 
          onChange={handleVolumeChange} 
          min={0} 
          max={1} 
        />
      </div>

      {/* CUERPO PRINCIPAL */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '20px' }}>
        
        {/* IZQUIERDA: Módulo de Oscilador */}
        <Oscillator />

        {/* CENTRO: Espacio vacío por ahora (La pantalla grande del dibujo) */}
        <div style={{ 
            width: '300px', 
            height: '150px', 
            border: '2px dashed #5d4037', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.5
        }}>
           Espacio para Futuros FX
        </div>

      </div>

      <Keyboard />
    </div>
  )
}

export default App;