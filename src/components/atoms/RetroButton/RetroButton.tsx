import './RetroButton.css';
import { Tooltip } from '@/components/atoms/Tooltip';
import { useHover } from '@/hooks/useHover';

interface RetroButtonProps {
  label: string;          // El icono o texto del botón
  isActive?: boolean;
  onClick: () => void;
  tooltipText?: string;   // El texto para el tooltip
}

export const RetroButton = ({ label, isActive = false, onClick, tooltipText }: RetroButtonProps) => {
  const { isHovered, hoverHandlers } = useHover();

  return (
    <button
      className={`retro-btn ${isActive ? 'active' : ''}`}
      onClick={onClick}
      {...hoverHandlers} // Conectamos el hover
    >
      {label}
      {/* Si nos pasan texto para tooltip, lo renderizamos */}
      {tooltipText && <Tooltip text={tooltipText} isShow={isHovered} />}
    </button>
  );
};