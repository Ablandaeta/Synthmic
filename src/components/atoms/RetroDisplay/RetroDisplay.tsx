import './RetroDisplay.css';

interface RetroDisplayProps {
  children: React.ReactNode; // Permite meter texto o divs dentro
  label?: string;            // Etiqueta pequeña (ej: "WAVE TYPE")
}

export const RetroDisplay = ({ children, label }: RetroDisplayProps) => {
  return (
    <div className="retro-display-container">
      <div className="retro-screen-glass">
        {children}
      </div>
      {label && <small className="retro-label">{label}</small>}
    </div>
  );
};