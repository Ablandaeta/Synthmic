import "./SynthChassis.css";
import type { ReactNode } from "react";

interface SynthChassisProps {
  header: ReactNode; // Slot para el logo y volumen
  rack: ReactNode; // Slot para los módulos
  keyboard: ReactNode; // Slot para el teclado
  onWakeUp: () => void; // Para despertar el audio al tocar la caja
}

export const SynthChassis = ({
  header,
  rack,
  keyboard,
  onWakeUp,
}: SynthChassisProps) => {
  return (
    <div
      className="synth-container"
      onMouseDown={onWakeUp}
      onTouchStart={onWakeUp}
    >
      {/* LA CAJA DE MADERA */}
      <div className="synth-chassis-box">
        {/* Slot Superior */}
        <div className="synth-top-row">{header}</div>

        {/* Slot Medio (Rack) */}

        {rack}

        {/* Slot Inferior */}
        <div className="synth-bottom-row">{keyboard}</div>
      </div>
    </div>
  );
};
