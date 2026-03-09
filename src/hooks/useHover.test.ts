import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useHover } from './useHover';

describe('Hook: useHover', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debería inicializarse con isHovered en false', () => {
    const { result } = renderHook(() => useHover());

    expect(result.current.isHovered).toBe(false);
  });

  it('debería cambiar isHovered a true cuando se dispara onMouseEnter', () => {
    const { result } = renderHook(() => useHover());

    act(() => {
      result.current.hoverHandlers.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(true);
  });

  it('debería cambiar isHovered a false cuando se dispara onMouseLeave', () => {
    const { result } = renderHook(() => useHover());
    
    // Preparar estado inicial (hover true)
    act(() => {
      result.current.hoverHandlers.onMouseEnter();
    });
    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverHandlers.onMouseLeave();
    });

    expect(result.current.isHovered).toBe(false);
  });
});