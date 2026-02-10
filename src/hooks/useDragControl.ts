import { useState, useEffect, useRef } from 'react';

interface UseDragControlProps {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  sensitivity?: number; // Opcional: para ajustar qué tan rápido gira
}

export const useDragControl = ({ 
  value, 
  onChange, 
  min, 
  max, 
  sensitivity = 200 
}: UseDragControlProps) => {
  
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);

  // Esta función se la daremos al <div> para que sepa cuándo empezar
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValueRef.current = value; // Guardamos el valor que tenía al empezar
    
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ns-resize';
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startYRef.current - e.clientY;
      const range = max - min;
      
      // Regla de tres: Pixels movidos -> Valor cambiado
      const deltaValue = (deltaY / sensitivity) * range;
      
      let newValue = startValueRef.current + deltaValue;
      
      // Limitar límites (Clamping)
      if (newValue < min) newValue = min;
      if (newValue > max) newValue = max;

      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, onChange, sensitivity]);

  return { 
    handleMouseDown, 
    isDragging 
  };
};