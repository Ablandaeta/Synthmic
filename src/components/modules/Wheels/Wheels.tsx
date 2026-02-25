import "./Wheels.css";
import { Wheel } from "@/components/atoms/Wheel";
import { useSynth } from "@/hooks";

export const Wheels = () => {
  const synth = useSynth();
  const handlePitchChange = (value: number) => {
    synth.setPitchBend(value);
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
    </div>
  );
};
