import { useState } from "react";
import "./EqModule.css";
import { useSynth } from "@/hooks";
import { Knob } from "@/components/atoms/Knob/Knob";
import { ModulePanel } from "@/components/layout/ModulePanel";
import { type EQBandId, type EQBandParams } from "@/audio/EQ";

export const EqModule = () => {
  const synth = useSynth();
  const [eqState, setEqState] = useState(synth.eqParams);

  const [selectedBandIndex, setSelectedBandIndex] = useState<1 | 2 | 3 | 4>(1);
  const selectedBandKey = `band${selectedBandIndex}` as Extract<EQBandId, "band1" | "band2" | "band3" | "band4">;
  const currentBandParams = eqState[selectedBandKey];

  const handleBandChange = (bandId: EQBandId, param: keyof EQBandParams, value: number) => {
    synth.setEQBand(bandId, { [param]: value });
    setEqState(prev => ({
      ...prev,
      [bandId]: {
        ...prev[bandId],
        [param]: value
      }
    }));
  };

  return (
    <ModulePanel label="EQ">
      <div className="eq-module-grid" aria-label="EQ Module">
        
        {/* ── CUADRANTE 1: HIGH PASS ── */}
        <div className=" eq-quadrant-border-right eq-quadrant-border-bottom">
          <h4 className="eq-quadrant-title">HIGH PASS</h4>
          <div className="eq-knobs-row">
            <Knob
              label="FREQ"
              min={20}
              max={1000}
              value={eqState.lowCut.frequency}
              onChange={(v) => handleBandChange("lowCut", "frequency", v)}
              formatTooltip={(v) => `${Math.round(v)} Hz`}
              size={36}
            />
            <Knob
              label="Q"
              min={0.1}
              max={10}
              value={eqState.lowCut.Q!}
              onChange={(v) => handleBandChange("lowCut", "Q", v)}
              formatTooltip={(v) => v.toFixed(2)}
              size={36}
            />
          </div>
        </div>

        {/* ── CUADRANTE 2: BAND SELECT ── */}
        <div className="eq-quadrant eq-quadrant-border-bottom">
          <h4 className="eq-quadrant-title">BAND SELECT</h4>
          <div className="eq-band-selector-container">
            <span className="eq-band-num eq-band-num-1">1</span>
            <span className="eq-band-num eq-band-num-2">2</span>
            <span className="eq-band-num eq-band-num-3">3</span>
            <span className="eq-band-num eq-band-num-4">4</span>
            <Knob
              label="BAND SELECTOR"
              min={1}
              max={4}
              value={selectedBandIndex}
              onChange={(v) => setSelectedBandIndex(Math.round(v) as 1 | 2 | 3 | 4)}
              formatTooltip={(v) => `BAND ${Math.round(v)}`}
              size={36}
            />
          </div>
        </div>

        {/* ── CUADRANTE 3: LOW PASS ── */}
        <div className="eq-quadrant eq-quadrant-border-right">
          <h4 className="eq-quadrant-title">LOW PASS</h4>
          <div className="eq-knobs-row">
            <Knob
              label="FREQ"
              min={1000}
              max={20000}
              value={eqState.highCut.frequency}
              onChange={(v) => handleBandChange("highCut", "frequency", v)}
              formatTooltip={(v) => `${Math.round(v)} Hz`}
              size={36}
            />
            <Knob
              label="Q"
              min={0.1}
              max={10}
              value={eqState.highCut.Q!}
              onChange={(v) => handleBandChange("highCut", "Q", v)}
              formatTooltip={(v) => v.toFixed(2)}
              size={36}
            />
          </div>
        </div>

        {/* ── CUADRANTE 4: ACTIVE BAND PARAMETERS ── */}
        <div className="eq-quadrant">
          <h4 className="eq-quadrant-title">ACTIVE BAND PARAMETERS</h4>
          <div className="eq-knobs-row">
            <Knob
              label="FREQ"
              min={20}
              max={20000}
              value={currentBandParams.frequency}
              onChange={(v) => handleBandChange(selectedBandKey, "frequency", v)}
              formatTooltip={(v) => `${Math.round(v)} Hz`}
              size={36}
            />
            <Knob
              label="Q"
              min={0.1}
              max={10}
              value={currentBandParams.Q!}
              onChange={(v) => handleBandChange(selectedBandKey, "Q", v)}
              formatTooltip={(v) => v.toFixed(2)}
              size={36}
            />
            <Knob
              label="GAIN"
              min={-6}
              max={6}
              value={currentBandParams.gain || 0}
              onChange={(v) => handleBandChange(selectedBandKey, "gain", v)}
              formatTooltip={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)} dB`}
              size={36}
            />
          </div>
        </div>

      </div>
    </ModulePanel>
  );
};
