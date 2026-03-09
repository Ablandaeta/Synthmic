import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useKeyboard } from './useKeyboard';
import { fireEvent } from '@testing-library/react';

describe('Hook: useKeyboard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debería llamar a onKeyPress cuando se pulsa una tecla', () => {
    const onKeyPress = vi.fn();
    const onKeyRelease = vi.fn();
    renderHook(() => useKeyboard(onKeyPress, onKeyRelease));

    fireEvent.keyDown(window, { key: 'a' });

    expect(onKeyPress).toHaveBeenCalledWith('a');
  });

  it('debería convertir las teclas a minúsculas', () => {
    const onKeyPress = vi.fn();
    renderHook(() => useKeyboard(onKeyPress, vi.fn()));

    fireEvent.keyDown(window, { key: 'Z' });

    expect(onKeyPress).toHaveBeenCalledWith('z');
  });

  it('debería llamar a onKeyRelease cuando se suelta una tecla', () => {
    const onKeyRelease = vi.fn();
    renderHook(() => useKeyboard(vi.fn(), onKeyRelease));

    fireEvent.keyUp(window, { key: 's' });

    expect(onKeyRelease).toHaveBeenCalledWith('s');
  });

  it('NO debería llamar a onKeyPress si el foco está en un input genérico', () => {
    const onKeyPress = vi.fn();
    renderHook(() => useKeyboard(onKeyPress, vi.fn()));
    
    // Simular evento con target que debe ser ignorado
    const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
    Object.defineProperty(event, 'target', { value: document.createElement('input') });

    window.dispatchEvent(event);

    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it('SÍ debería llamar a onKeyPress si el foco está en un input range (Knob/Slider)', () => {
    const onKeyPress = vi.fn();
    renderHook(() => useKeyboard(onKeyPress, vi.fn()));
    
    const input = document.createElement('input');
    input.type = 'range';
    const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
    Object.defineProperty(event, 'target', { value: input });

    window.dispatchEvent(event);

    expect(onKeyPress).toHaveBeenCalledWith('a');
  });

  it('NO debería llamar a onKeyPress si la tecla es repetida (e.repeat)', () => {
    const onKeyPress = vi.fn();
    renderHook(() => useKeyboard(onKeyPress, vi.fn()));

    fireEvent.keyDown(window, { key: 'a', repeat: true });

    expect(onKeyPress).not.toHaveBeenCalled();
  });
});
