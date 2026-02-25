import './Keyboard.css';
import { useState, useMemo, useCallback } from 'react';
import { Key } from '@/components/atoms/Key';
import { getOctaveNotes, COMPUTER_KEY_MAP } from '@/data/note';
import { useSynth, useComputerKeyboard } from '@/hooks';

interface KeyboardProps {
  octave?: number;
}

export const Keyboard = ({ octave = 4 }: KeyboardProps) => {
  const synth = useSynth();
  // Estado para rastrear qué frecuencias están activas (para visualización)
  const [activeFreqs, setActiveFreqs] = useState<Set<number>>(new Set());

  // Generamos las notas de la octava actual
  const octaveNotes = useMemo(() => getOctaveNotes(octave), [octave]);

  const handlePress = useCallback((freq: number) => {
    synth.playTone(freq);
    setActiveFreqs((prev) => new Set(prev).add(freq));
  }, [synth]);

  const handleRelease = useCallback((freq: number) => {
    synth.stopTone(freq);
    setActiveFreqs((prev) => {
      const next = new Set(prev);
      next.delete(freq);
      return next;
    });
  }, [synth]);

  // Manejador para el teclado de la computadora
  const onKeyPress = useCallback((key: string) => {
    const noteIndex = COMPUTER_KEY_MAP[key];
    if (noteIndex !== undefined && octaveNotes[noteIndex]) {
      handlePress(octaveNotes[noteIndex].freq);
    }
  }, [octaveNotes, handlePress]);

  const onKeyRelease = useCallback((key: string) => {
    const noteIndex = COMPUTER_KEY_MAP[key];
    if (noteIndex !== undefined && octaveNotes[noteIndex]) {
      handleRelease(octaveNotes[noteIndex].freq);
    }
  }, [octaveNotes, handleRelease]);

  // Registramos el hook del teclado
  useComputerKeyboard(onKeyPress, onKeyRelease);

  // Filtramos solo las blancas para crear la base del layout CSS
  const whiteKeys = octaveNotes.filter(key => !key.isBlack);

  return (
    <div className="keyboard-jaw">
      {whiteKeys.map((whiteKey) => {
        // Buscamos si la SIGUIENTE nota en la lista original es negra
        const originalIndex = octaveNotes.findIndex(key => key.freq === whiteKey.freq);
        const nextNote = octaveNotes[originalIndex + 1];
        const hasBlackNeighbor = nextNote && nextNote.isBlack;

        return (
          <div key={`${whiteKey.note}-${whiteKey.freq}`} className="key-slot">
            {/* 1. Tecla Blanca */}
            <Key
              note={whiteKey.note}
              frequency={whiteKey.freq}
              isBlack={false}
              isActive={activeFreqs.has(whiteKey.freq)}
              onPress={handlePress}
              onRelease={handleRelease}
            />

            {/* 2. Tecla Negra (superpuesta) */}
            {hasBlackNeighbor && (              
              <Key
                note={nextNote.note}
                frequency={nextNote.freq}
                isBlack={true}
                isActive={activeFreqs.has(nextNote.freq)}
                onPress={handlePress}
                onRelease={handleRelease}
              />                
            )}
          </div>
        );
      })}
    </div>
  );
};