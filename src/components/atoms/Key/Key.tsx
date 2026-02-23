import { Tooltip } from '../Tooltip';
import { useHover } from '@/hooks';
import './Key.css';
import { useState } from 'react';

// Definimos el "contrato": ¿Qué necesita un diente para existir?
interface KeyProps {
  note: string;         // Ej: "C", "D#"
  frequency: number;    // Ej: 261.63
  isBlack?: boolean;    // ¿Es tecla negra? (Opcional, por defecto false)
  onPress: (freq: number) => void;  // Función que avisa "me están apretando"
  onRelease: (freq: number) => void;            // Función que avisa "me soltaron"
}

export const Key = ({ note, frequency, isBlack = false, onPress, onRelease }: KeyProps) => { 

  const { isHovered, hoverHandlers } = useHover();
  const [isPressed, setIsPressed] = useState(false);

  // Clase dinámica: Si isBlack es true, añade la clase "black"
  const className = `key-tooth ${isBlack ? 'black' : ''} ${isPressed ? 'pressed' : ''}`;

  const handleMouseEnter = (e: React.MouseEvent) => {
    // A. mostrar el tooltip 
    hoverHandlers.onMouseEnter();
    // B. Si el usuario está arrastrando el mouse con el botón izquierdo apretado, también queremos tocar la nota
    if (e.buttons === 1) {
      onPress(frequency); 
      setIsPressed(true);
    }
  };

  const handleMouseLeave = () => {
    setIsPressed(false);         // resetear el estado de "apretado" 
    onRelease(frequency);                 // Cortamos el sonido
    hoverHandlers.onMouseLeave(); // Ocultamos el tooltip
  };

  // 3. Pequeño ajuste para evitar que se seleccione el texto al arrastrar
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita comportamientos raros del navegador
    setIsPressed(true);
    onPress(frequency);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    onRelease(frequency);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
     e.preventDefault(); // A veces necesario en móviles para evitar scroll, probar si hace falta
     setIsPressed(true);
     onPress(frequency);
  };

  const handleTouchEnd = () => {
     setIsPressed(false);
     onRelease(frequency);
  };

  return (
   
    <button
      className={className}
      // EVENTOS DE SONIDO (PRESS)
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      
      // EVENTOS DE SONIDO (RELEASE)
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}

      
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