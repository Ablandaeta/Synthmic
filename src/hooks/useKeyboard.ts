// src/hooks/useComputerKeyboard.ts
import { useEffect } from 'react';

export function useComputerKeyboard(
  onKeyPress: (key: string) => void, 
  onKeyRelease: (key: string) => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input o textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.repeat) return; 
      
      onKeyPress(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      onKeyRelease(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyPress, onKeyRelease]);
}