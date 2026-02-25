import "./Wheels.css";
import { Wheel } from "@/components/atoms/Wheel";
import { useSynth } from "@/hooks";

export const Wheels = () => {
  const synth = useSynth();
  const handlePitchChange = (value: number) => {
    synth.setPitchBend(value);
  };
  const handleModChange = (value: number) => {
    synth.setModulation(value);
  };

  return (
    <div className="wheels-container">
      <Wheel
        label="PITCH"
        min={-200} // -2 semitonos
        max={200} // +2 semitonos
        isSpringLoaded={true}
        onChange={handlePitchChange}
      />
      <Wheel
        label="MOD"
        min={0}
        max={100}
        initialValue={0}
        onChange={handleModChange}
      />
    </div>
  );
};
