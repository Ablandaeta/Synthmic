import './Rack.css'; 
import { Children } from 'react';
import type { ReactNode } from 'react';

interface RackProps {
  children: ReactNode;
}

export const Rack = ({ children }: RackProps) => {
  return (
    <div className="module-rack">
        
      {Children.map(children, (child) => {
        // Si el hijo es nulo (por renderizado condicional), no hacemos nada
        if (!child) return null;

        return (
          <div className="rack-module">
            {child}
          </div>
        );
      })}
      
      {/* Opcional: El espacio vacío al final siempre fijo */}
      <div className="rack-blank-space">
        <span>+ Future FX Chain</span>
      </div>
    </div>
  );
};