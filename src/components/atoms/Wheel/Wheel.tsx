import './Wheel.css';
import { useState } from 'react';

interface WheelProps {
  min?: number;
  max?: number;
  label?: string;
  initialValue?: number;
  isSpringLoaded?: boolean; // Si es true, vuelve a center al soltar
  onChange: (value: number) => void;
}

export function Wheel({ label, initialValue = 0, isSpringLoaded = false, onChange, min = 0, max = 100 }: WheelProps) {
   
  const center = (min + max) / 2;
  if (isSpringLoaded && !initialValue) {
    initialValue = center;
   }

  const [value, setValue] = useState(initialValue);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setValue(newVal);
    onChange(newVal);
  };

  const handleRelease = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (isSpringLoaded) {
      setValue(center);
      onChange(center);
    }
    e.currentTarget.blur();
  };

  return (
    <div className="wheel-container">
      <div className="wheel-track">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          className="wheel-input"
          onChange={handleInput}
          onMouseUp={(e) => handleRelease(e)}
          onTouchEnd={(e) => handleRelease(e)}
        />
      </div>
      {label && <span className="wheel-label">{label}</span>}
    </div>
  );
}