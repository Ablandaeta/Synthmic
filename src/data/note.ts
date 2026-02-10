export interface NoteData {
  note: string;
  freq: number;
  isBlack: boolean;
}

export const OCTAVE_4: NoteData[] = [
  { note: 'C', freq: 261.63, isBlack: false },
  { note: 'C#', freq: 277.18, isBlack: true },
  { note: 'D', freq: 293.66, isBlack: false },
  { note: 'D#', freq: 311.13, isBlack: true },
  { note: 'E', freq: 329.63, isBlack: false },
  { note: 'F', freq: 349.23, isBlack: false },
  { note: 'F#', freq: 369.99, isBlack: true },
  { note: 'G', freq: 392.00, isBlack: false },
  { note: 'G#', freq: 415.30, isBlack: true },
  { note: 'A', freq: 440.00, isBlack: false },
  { note: 'A#', freq: 466.16, isBlack: true },
  { note: 'B', freq: 493.88, isBlack: false },
  { note: 'C5', freq: 523.25, isBlack: false }, // El Do agudo para cerrar
];