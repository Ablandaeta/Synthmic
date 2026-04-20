import "./ModulePanel.css";
import { type ReactNode } from "react";

interface ModulePanelProps {
  /** Texto que aparece en el footer — siempre al mismo sitio en todos los módulos */
  label: string;
  /** Contenido del módulo (knobs, switches, barras, etc.) */
  children: ReactNode;
}

/**
 * ModulePanel — Layout base para todos los módulos del Rack.
 *
 * Garantiza:
 *  - Altura consistente (height: 100% del rack-module slot)
 *  - Footer label siempre anclado al borde inferior con el mismo estilo
 *  - Área de contenido con min-height: 0 para evitar overflow en flex
 *  - Padding-bottom en el contenido para que los labels de los Knob
 *    (position: absolute, bottom: -1.5em) no solapen con el footer
 */
export const ModulePanel = ({ label, children }: ModulePanelProps) => {
  return (
    <div className="module-panel">
      <div className="module-panel__content">{children}</div>
      <p className="module-panel__footer">{label}</p>
    </div>
  );
};
