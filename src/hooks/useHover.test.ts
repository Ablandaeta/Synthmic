import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useHover } from './useHover.ts';

describe('Hook: useHover', () => {
  
  it('debería inicializarse en false', () => {
    // Renderizamos el hook en el vacío
    const { result } = renderHook(() => useHover());

    // Comprobamos su valor inicial
    expect(result.current.isHovered).toBe(false);
  });

  it('debería cambiar a true cuando el mouse entra', () => {
    const { result } = renderHook(() => useHover());

    // Simulamos la acción del usuario usando 'act'
    act(() => {
      result.current.hoverHandlers.onMouseEnter();
    });

    // Comprobamos que el estado se actualizó
    expect(result.current.isHovered).toBe(true);
  });

  it('debería volver a false cuando el mouse sale', () => {
    const { result } = renderHook(() => useHover());

    // Entramos...
    act(() => {
      result.current.hoverHandlers.onMouseEnter();
    });
    
    // Y salimos
    act(() => {
      result.current.hoverHandlers.onMouseLeave();
    });

    // Comprobamos que volvió a su estado original
    expect(result.current.isHovered).toBe(false);
  });

});