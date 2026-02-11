import './Tooltip.css'; // Moveremos el CSS aquí

interface TooltipProps {
  text: string;
  isShow: boolean;
}

export const Tooltip = ({ text, isShow }: TooltipProps) => {
  // Si no hay que mostrarlo, no renderizamos nada (limpieza en el DOM)
  if (!isShow) return null;

  return (
    <div className="tooltip-container">
      {text}
      {/* La flechita css */}
      <div className="tooltip-arrow" />
    </div>
  );
};