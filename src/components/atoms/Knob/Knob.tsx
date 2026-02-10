import './Knob.css';
import { useDragControl } from '@/hooks/useDragControl';

interface KnobProps {
  label?: string;
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
}

export default function Knob({ label, min = 0, max = 1, value, onChange }: KnobProps) {
  
    // 1. Usamos el hook para manejar la lógica de arrastre
    const { handleMouseDown } = useDragControl({ 
    value, 
    onChange, 
    min, 
    max 
  });

  // 2. Solo calculamos lo visual (Grados)
  const percentage = (value - min) / (max - min);
  const rotation = -135 + (percentage * 270);

  return (
    <div className="knob-socket">
      <div 
        className="knob-eyeball" 
        onMouseDown={handleMouseDown} // Conectamos el evento del hook aquí
        style={{transform:`rotate(${rotation}deg)`}}
      >
        <div 
            className="knob-iris"
            // O aplicar la rotación solo al iris y centrarlo
            // style={{ 
            //   transform: `translate(-50%, -50%) rotate(${rotation}deg)` 
            // }}
        >
          <div className="knob-pupil"></div>
        </div>
        
        <div className="knob-glint"></div>
      </div>
      
      {label && <div className="knob-label">{label}</div>}
    </div>
  );
};