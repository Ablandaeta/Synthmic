import "./EnvelopeControl.css";
import { useState } from "react";
import { useSynth } from "@/hooks";
import { Knob } from "@/components/atoms/Knob/Knob";
import { type Envelope } from "@/audio/Oscillator";

// ── ADSR config ───────────────────────────────────────────────────────────────

const ADSR_CONFIG: Array<{
  key: keyof Envelope;
  label: string;
  min: number;
  max: number;
  formatTooltip?: (v: number) => string;
}> = [
  {
    key: "attack",
    label: "ATTACK",
    min: 0.01,
    max: 2,
    formatTooltip: (v) => `${(v * 1000).toFixed(0)} ms`,
  },
  {
    key: "decay",
    label: "DECAY",
    min: 0.01,
    max: 2,
    formatTooltip: (v) => `${v.toFixed(2)} s`,
  },
  {
    key: "sustain",
    label: "SUSTAIN",
    min: 0,
    max: 1,
    formatTooltip: (v) => `${Math.round(v * 10)}`,
  },
  {
    key: "release",
    label: "RELEASE",
    min: 0.01,
    max: 5,
    formatTooltip: (v) => `${v.toFixed(2)} s`,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export const EnvelopeControl = () => {
  const synth = useSynth();

  // Polyphony state (backed by audio engine)
  const [polyphony, setPolyphonyState] = useState<number>(synth.polyphony);

  // ADSR state (backed by audio engine)
  const [envelope, setEnvelopeState] = useState<Envelope>(synth.envelope);

  // Glissando — UI only, backend not yet implemented
  const [glissando, setGlissando] = useState<number>(0);

  const handlePolyphonyChange = (v: number) => {
    const rounded = Math.round(v);
    setPolyphonyState(rounded);
    synth.setPolyphony(rounded);
  };

  const handleEnvelopeChange = (key: keyof Envelope, v: number) => {
    const updated = { ...envelope, [key]: v };
    setEnvelopeState(updated);
    synth.setEnvelope(updated);
  };

  return (
    <div className="envelope-control">
      {/* ── TOP ROW: Polyphony + Glissando ── */}
      <div className="envelope-top-row">
        <div className="envelope-knob-col">
          <Knob
            label="POLYPHONY"
            min={1}
            max={16}
            value={polyphony}
            onChange={handlePolyphonyChange}
            formatTooltip={(v) => `${Math.round(v)} voices`}
            size={46}
          />
        </div>

        <div className="envelope-knob-col">
          <Knob
            label="GLISSANDO"
            min={0}
            max={1}
            value={glissando}
            onChange={setGlissando}
            formatTooltip={(v) => `${Math.round(v * 100)}%`}
            size={46}
          />
        </div>
      </div>

      {/* ── BOTTOM ROW: ADSR ── */}
      <div className="envelope-adsr-row">
        {ADSR_CONFIG.map(({ key, label, min, max, formatTooltip }) => (
          <div className="envelope-knob-col" key={key}>
            <Knob
              label={label}
              min={min}
              max={max}
              value={envelope[key]}
              onChange={(v) => handleEnvelopeChange(key, v)}
              formatTooltip={formatTooltip}
              size={38}
            />
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <p className="envelope-footer-label">ENVELOPE</p>
    </div>
  );
};
