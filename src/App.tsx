import './App.css'
import { Keyboard } from '@/components/modules/Keyboard';
import { synth } from './audio/AudioEngine'; // Importamos la instancia

function App() {
  
  // Función para despertar el audio context si está dormido
  const handleWakeUp = () => {
    synth.initialize();
  };

  return (
    // Agregamos onMouseDown aquí para asegurar que el audio arranque al primer toque
    <div className="synth-container" onMouseDown={handleWakeUp} onTouchStart={handleWakeUp}>
      <h1 style={{ fontFamily: 'serif', letterSpacing: '5px' }}>SYNTHMIC</h1>
      <Keyboard />
    </div>
  )
}

export default App;