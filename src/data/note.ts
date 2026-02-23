export interface NoteData {
  note: string;
  freq: number;
  isBlack: boolean;
}

export const NOTES = [
  { note: 'C', isBlack: false },
  { note: 'C#', isBlack: true },
  { note: 'D', isBlack: false },
  { note: 'D#', isBlack: true },
  { note: 'E', isBlack: false },
  { note: 'F', isBlack: false },
  { note: 'F#', isBlack: true },
  { note: 'G', isBlack: false },
  { note: 'G#', isBlack: true },
  { note: 'A', isBlack: false },
  { note: 'A#', isBlack: true },
  { note: 'B', isBlack: false },
];

export const getFrequency = (noteIndex: number, octave: number): number => {
  // MIDI note number for C0 is 12
  // C4 is midi 60
  // formula: f = 440 * 2^((midi - 69) / 12)
  const midiNumber = noteIndex + (octave + 1) * 12;
  return 440 * Math.pow(2, (midiNumber - 69) / 12);
};

export const getOctaveNotes = (octave: number): NoteData[] => {
  const octaveNotes = NOTES.map((n, index) => ({
    note: n.note,
    freq: getFrequency(index, octave),
    isBlack: n.isBlack,
  }));

  // Add the next octave's C to close the octave
  octaveNotes.push({
    note: 'C',
    freq: getFrequency(0, octave + 1),
    isBlack: false,
  });

  return octaveNotes;
};

// Map computer keys to note indices (0-12)
export const COMPUTER_KEY_MAP: Record<string, number> = {
  'a': 0,  // C
  'w': 1,  // C#
  's': 2,  // D
  'e': 3,  // D#
  'd': 4,  // E
  'f': 5,  // F
  't': 6,  // F#
  'g': 7,  // G
  'y': 8,  // G#
  'h': 9,  // A
  'u': 10, // A#
  'j': 11, // B
  'k': 12, // C (next octave)
};