import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useDragControl } from './useDragControl';
import { fireEvent } from '@testing-library/react';

describe('Hook: useDragControl', () => {
  afterEach(() => {
    vi.clearAllMocks();
    // Limpieza de estilos de body por si acaso
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  });

  it('debería inicializarse con isDragging en false', () => {
    const { result } = renderHook(() => useDragControl({
      value: 0.5,
      min: 0,
      max: 1,
      onChange: vi.fn()
    }));

    expect(result.current.isDragging).toBe(false);
  });

  it('debería activar isDragging al llamar a handleMouseDown', () => {
    const { result } = renderHook(() => useDragControl({
      value: 0.5,
      min: 0,
      max: 1,
      onChange: vi.fn()
    }));
    const mockEvent = { clientY: 100 } as React.MouseEvent;

    act(() => {
      result.current.handleMouseDown(mockEvent);
    });

    expect(result.current.isDragging).toBe(true);
    expect(document.body.style.cursor).toBe('ns-resize');
  });

  it('debería llamar a onChange al mover el mouse mientras se arrastra', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useDragControl({
      value: 0.5,
      min: 0,
      max: 1,
      onChange,
      sensitivity: 100 // Para facilitar el cálculo en el test
    }));
    
    // Iniciar arrastre en Y=100
    act(() => {
      result.current.handleMouseDown({ clientY: 100 } as React.MouseEvent);
    });

    // Act: Mover mouse hacia arriba (Y decrece -> deltaY aumenta -> valor aumenta)
    // deltaY = startYRef - e.clientY = 100 - 50 = 50
    // deltaValue = (50 / 100) * (1 - 0) = 0.5
    // newValue = 0.5 + 0.5 = 1.0
    act(() => {
      fireEvent.mouseMove(window, { clientY: 50 });
    });

    expect(onChange).toHaveBeenCalledWith(1.0);
  });

  it('debería aplicar clamping según min y max', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useDragControl({
      value: 0.5,
      min: 0,
      max: 1,
      onChange,
      sensitivity: 10
    }));
    
    act(() => {
      result.current.handleMouseDown({ clientY: 100 } as React.MouseEvent);
    });

    // Act: Mover mouse mucho hacia arriba (sobrepasar max)
    act(() => {
      fireEvent.mouseMove(window, { clientY: 0 });
    });
    // deltaY = 100 - 0 = 100. deltaValue = 100/10 * 1 = 10. newValue = 0.5 + 10 = 10.5 -> Clamped to 1.0
    expect(onChange).toHaveBeenLastCalledWith(1.0);

    // Act: Mover mouse mucho hacia abajo (sobrepasar min)
    act(() => {
      fireEvent.mouseMove(window, { clientY: 200 });
    });
    // deltaY = 100 - 200 = -100. deltaValue = -10. newValue = 0.5 - 10 = -9.5 -> Clamped to 0.0
    expect(onChange).toHaveBeenLastCalledWith(0.0);
  });

  it('debería detener el arrastre al soltar el mouse', () => {
    const { result } = renderHook(() => useDragControl({
      value: 0.5,
      min: 0,
      max: 1,
      onChange: vi.fn()
    }));
    
    act(() => {
      result.current.handleMouseDown({ clientY: 100 } as React.MouseEvent);
    });
    expect(result.current.isDragging).toBe(true);

    act(() => {
      fireEvent.mouseUp(window);
    });

    expect(result.current.isDragging).toBe(false);
    expect(document.body.style.cursor).toBe('');
  });
});
