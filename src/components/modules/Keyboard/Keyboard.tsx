import { Key } from '@/components/atoms/Key';
import { OCTAVE_4 } from '@/data/note';
import { useSynth } from '@/hooks';
import './Keyboard.css';

export const Keyboard = () => {
  const synth = useSynth();
  const handlePress = (freq: number) => synth.playTone(freq);
  const handleRelease = (freq: number) => synth.stopTone(freq);

  // Filtramos solo las blancas para crear la base
  const whiteKeys = OCTAVE_4.filter(key => !key.isBlack);

  return (
    <div className="keyboard-jaw">
      {whiteKeys.map((whiteKey) => {
        // Buscamos si la SIGUIENTE nota en la lista original es negra
        // (Ej: Después de C viene C#, que es negra)
        const originalIndex = OCTAVE_4.findIndex(key => key.note === whiteKey.note);
        const nextNote = OCTAVE_4[originalIndex + 1];
        const hasBlackNeighbor = nextNote && nextNote.isBlack;

        return (
          <div key={whiteKey.note} className="key-slot">
            {/* 1. Renderizamos la Tecla Blanca */}
            <Key
              note={whiteKey.note}
              frequency={whiteKey.freq}
              isBlack={false}
              onPress={handlePress}
              onRelease={handleRelease}
            />

            {/* 2. Si tiene vecina negra, la renderizamos AQUÍ mismo (superpuesta) */}
            {hasBlackNeighbor && (              
                  <Key
                    note={nextNote.note}
                    frequency={nextNote.freq}
                    isBlack={true}
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