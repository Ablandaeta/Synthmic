import "./EqPlaceholder.css";
import { ModulePanel } from "@/components/layout/ModulePanel";

/**
 * EqPlaceholder — Slot vacío para el futuro módulo EQ.
 */
export const EqPlaceholder = () => {
  return (
    <ModulePanel label="EQ">
      <div className="eq-placeholder" aria-label="EQ module — coming soon">
        {/* Simulated inactive EQ bars */}
        <div className="eq-placeholder__bands" aria-hidden="true">
          {[28, 48, 40, 60, 36, 44, 24].map((h, i) => (
            <div
              key={i}
              className="eq-placeholder__bar"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>

        {/* Coming soon badge */}
        <span className="eq-placeholder__badge">Coming Soon</span>
      </div>
    </ModulePanel>
  );
};
