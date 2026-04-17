import "./WaveformSelector.css";
import { useSynth } from "@/hooks";
import { useState } from "react";

// SVG icons for each waveform, matching the reference image style
const WaveIcons: Record<OscillatorType | "whitenoise", React.ReactNode> = {
  sine: (
    <svg viewBox="0 0 40 20" width="36" height="18" aria-hidden="true">
      <path
        d="M2 10 C8 2, 12 2, 20 10 C28 18, 32 18, 38 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  triangle: (
    <svg viewBox="0 0 40 20" width="36" height="18" aria-hidden="true">
      <polyline
        points="2,18 10,2 20,18 30,2 38,18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  square: (
    <svg viewBox="0 0 40 20" width="36" height="18" aria-hidden="true">
      <polyline
        points="2,18 2,4 14,4 14,18 26,18 26,4 38,4 38,18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sawtooth: (
    <svg viewBox="0 0 40 20" width="36" height="18" aria-hidden="true">
      <polyline
        points="2,18 14,2 14,18 26,2 26,18 38,2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  whitenoise: (
    <svg viewBox="0 0 40 20" width="36" height="18" aria-hidden="true">
      <polyline
        points="2,10 5,4 8,14 11,6 14,16 17,8 20,12 23,3 26,15 29,7 32,13 35,5 38,10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

type WaveOption = {
  type: OscillatorType | "whitenoise";
  label: string;
};

const WAVE_OPTIONS: WaveOption[] = [
  { type: "sine",       label: "SINE" },
  { type: "triangle",   label: "TRIANGLE" },
  { type: "square",     label: "SQUARE" },
  { type: "sawtooth",   label: "SAWTOOTH" },
  { type: "whitenoise", label: "WHITE NOISE" },
];

export const WaveformSelector = () => {
  const synth = useSynth();
  const [selectedWave, setSelectedWave] = useState<OscillatorType>(
    synth.waveform
  );

  const handleWaveChange = (wave: OscillatorType | "whitenoise") => {
    // White noise is UI-only for now (no backend support yet)
    if (wave === "whitenoise") return;
    setSelectedWave(wave);
    synth.setWaveform(wave);
  };

  return (
    <div className="waveform-selector" role="radiogroup" aria-label="Waveform selector">
      <ul className="waveform-list">
        {WAVE_OPTIONS.map(({ type, label }) => {
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
                {WaveIcons[type]}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="waveform-footer-label">WAVEFORMS</p>
    </div>
  );
};
