import "./WaveformSelector.css";
import { useSynth } from "@/hooks";
import { useState, type ReactElement } from "react";
import { ModulePanel } from "@/components/layout/ModulePanel";
import {
  SineIcon,
  TriangleIcon,
  SquareIcon,
  SawtoothIcon,
  WhiteNoiseIcon,
} from "@/components/atoms/WaveIcons";

// ── Types ──────────────────────────────────────────────────────────────────────
// OscillatorType nativo del DOM también incluye "custom" (AudioWorklet).
// Definimos solo las formas de onda que realmente exponemos en la UI.
type SupportedWaveform = "sine" | "triangle" | "square" | "sawtooth" | "whitenoise";
type AudioWaveform = Exclude<SupportedWaveform, "whitenoise">;

// ── Wave options ───────────────────────────────────────────────────────────────
type WaveOption = { type: SupportedWaveform; label: string; Icon: () => ReactElement };

const WAVE_OPTIONS: WaveOption[] = [
  { type: "sine",       label: "SINE",        Icon: SineIcon },
  { type: "triangle",   label: "TRIANGLE",    Icon: TriangleIcon },
  { type: "square",     label: "SQUARE",      Icon: SquareIcon },
  { type: "sawtooth",   label: "SAWTOOTH",    Icon: SawtoothIcon },
  { type: "whitenoise", label: "WHITE NOISE", Icon: WhiteNoiseIcon },
];

// ── Component ──────────────────────────────────────────────────────────────────
export const WaveformSelector = () => {
  const synth = useSynth();
  const [selectedWave, setSelectedWave] = useState<AudioWaveform>(
    synth.waveform as AudioWaveform
  );

  const handleWaveChange = (wave: SupportedWaveform) => {
    if (wave === "whitenoise") return; // UI-only for now
    setSelectedWave(wave);
    synth.setWaveform(wave);
  };

  return (
    <ModulePanel label="WAVEFORMS">
      <div className="waveform-selector" role="radiogroup" aria-label="Waveform selector">
        <ul className="waveform-list">
          {WAVE_OPTIONS.map(({ type, label, Icon }) => {
            const isActive = type !== "whitenoise" && selectedWave === type;
            return (
              <li key={type} className="waveform-row">
                {/* Label */}
                <span className="waveform-label">{label}</span>

                {/* Toggle Switch */}
                <button
                  className={`waveform-switch ${isActive ? "waveform-switch--active" : ""}`}
                  onClick={() => handleWaveChange(type)}
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`Select ${label} waveform`}
                  id={`waveform-${type}`}
                >
                  <span className="waveform-switch__thumb" />
                </button>

                {/* Waveform Icon */}
                <span className={`waveform-icon ${isActive ? "waveform-icon--active" : ""}`}>
                  <Icon />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </ModulePanel>
  );
};
