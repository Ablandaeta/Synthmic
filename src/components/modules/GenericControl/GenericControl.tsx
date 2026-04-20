import "./GenericControl.css";
import { Knob } from "@/components/atoms/Knob/Knob";
import { ModulePanel } from "@/components/layout/ModulePanel";

interface GenericControlProps {
  /** Label del knob (aria-label interno) */
  label: string;
  /** Etiqueta del footer del módulo — usa `label` si no se especifica */
  moduleLabel?: string;
  min?: number;
  max?: number;
  value: number;
  onChange: (v: number) => void;
  formatTooltip?: (v: number) => string;
  knobSize?: number;
}

/**
 * GenericControl — Módulo de rack reutilizable con un único Knob.
 * Completamente prop-based (no consume useSynth directamente).
 */
export const GenericControl = ({
  label,
  moduleLabel,
  min = 0,
  max = 1,
  value,
  onChange,
  formatTooltip,
  knobSize = 54,
}: GenericControlProps) => {
  return (
    <ModulePanel label={moduleLabel ?? label}>
      <div className="generic-control">
        <Knob
          label={label}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          formatTooltip={formatTooltip}
          size={knobSize}
        />
      </div>
    </ModulePanel>
  );
};
