import { createContext } from 'react';
import { AudioEngine } from '@/audio/AudioEngine';

export const SynthContext = createContext<AudioEngine | null>(null);