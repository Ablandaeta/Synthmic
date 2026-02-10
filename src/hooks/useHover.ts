import { useState, useMemo } from 'react';

export const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Usamos useMemo para que estas funciones no cambien en cada render
  // (Optimización pequeña pero buena costumbre)
  const eventHandlers = useMemo(() => ({
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }), []);

  return { isHovered, hoverHandlers: eventHandlers };
};