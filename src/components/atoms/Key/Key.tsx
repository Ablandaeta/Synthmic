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

  return (
    <button
      className={className}
      onMouseDown={() => onPress(frequency)} // Al hacer click
      onMouseUp={onRelease}                  // Al soltar
      onMouseLeave={onRelease}               // Si sale el mouse mientras presiona
      
      // Accesibilidad y Touch (para móviles en el futuro)
      onTouchStart={() => onPress(frequency)}
      onTouchEnd={onRelease}
      title={note}
      aria-label={`Tecla ${note}, frecuencia ${frequency} Hz`}
      
    >
    </button>
  );
};