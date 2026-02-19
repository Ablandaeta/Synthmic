import './Knob.css';
import { useDragControl } from '@/hooks/useDragControl';
import { useHover } from '@/hooks/useHover'; 
import { Tooltip } from '@/components/atoms/Tooltip'; 

interface KnobProps {
  label?: string;
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  formatTooltip?: (val: number) => string
  size?: number
}

interface CustomCSS extends React.CSSProperties {
  '--knob-size'?: string;
}

export const Knob = ({ 
  label, min = 0, max = 1, value, onChange, 
  // Por defecto, formateamos a porcentaje, pero se puede cambiar desde fuera
  formatTooltip = (v) => `${Math.round(((v - min) / (max - min)) * 100)}%`,
  size = 80 
}: KnobProps) => {
  
  // 1. Usamos el hook para manejar la lógica de arrastre
  const { handleMouseDown, isDragging } = useDragControl({ 
    value, 
    onChange, 
    min, 
    max 
  });
  // 2. Usamos el hook para manejar el hover (para mostrar el tooltip)
  const { isHovered, hoverHandlers } = useHover();

  // 3. Solo calculamos lo visual (Grados)
  const percentage = (value - min) / (max - min);
  const rotation = -135 + (percentage * 270);
  
  return (
    <div className="knob-socket"
    {...hoverHandlers}
    style={{'--knob-size': `${size}px` } as CustomCSS}
    >
        <Tooltip 
        text={formatTooltip(value)} 
        isShow={isDragging || isHovered} 
        
      />
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