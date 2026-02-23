import { useState, type ReactNode } from 'react';
import { AudioEngine } from '@/audio/AudioEngine';
import { SynthContext } from './SynthContext';

interface Props {
  children: ReactNode;
}

export const SynthProvider = ({ children }: Props) => {
  const [engine] = useState(() => new AudioEngine());

  return (
    <SynthContext.Provider value={engine}>
      {children}
    </SynthContext.Provider>
  );
};