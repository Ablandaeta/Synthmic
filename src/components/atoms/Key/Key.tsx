import { Tooltip } from '../Tooltip';
import { useHover } from '@/hooks/useHover';
import './Key.css';

// Definimos el "contrato": ¿Qué necesita un diente para existir?
interface KeyProps {
  note: string;         // Ej: "C", "D#"
  frequency: number;    // Ej: 261.63
  isBlack?: boolean;    // ¿Es tecla negra? (Opcional, por defecto false)
  onPress: (freq: number) => void;  // Función que avisa "me están apretando"
  onRelease: () => void;            // Función que avisa "me soltaron"
}

export default function Key({ note, frequency, isBlack = false, onPress, onRelease }: KeyProps) {
  
  // Clase dinámica: Si isBlack es true, añade la clase "black"
  const className = `key-tooth ${isBlack ? 'black' : ''}`;

  const { isHovered, hoverHandlers } = useHover();

  const handleMouseLeave = () => {
    onRelease();                 // A. Cortamos el sonido
    hoverHandlers.onMouseLeave(); // B. Ocultamos el tooltip
  };
  const handleMouseEnter = (e: React.MouseEvent) => {
    // A. mostrar el tooltip (si no lo está ya)
    hoverHandlers.onMouseEnter();
    // B. Si el usuario está arrastrando el mouse con el botón izquierdo apretado, también queremos tocar la nota
    if (e.buttons === 1) {
      onPress(frequency); 
    }
  };

  // 3. Pequeño ajuste para evitar que se seleccione el texto al arrastrar
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita comportamientos raros del navegador
    onPress(frequency);
  };

  return (
   
    <button
      className={className}
      // EVENTOS DE SONIDO (PRESS)
      onMouseDown={handleMouseDown}
      onTouchStart={() => onPress(frequency)}
      
      // EVENTOS DE SONIDO (RELEASE)
      onMouseUp={onRelease}
      onTouchEnd={onRelease}

      
      // Usamos el handleMouseEnter para detectar si el usuario está arrastrando el mouse mientras lo tiene apretado
      onMouseEnter={handleMouseEnter}
      
      // Y usamos nuestra función combinada para el Leave
      onMouseLeave={handleMouseLeave}
      
      // Accesibilidad
      aria-label={`Tecla ${note}, frecuencia ${frequency} Hz`}
    >
      <Tooltip text={note} isShow={isHovered} /> 
    </button>
    
  );
};