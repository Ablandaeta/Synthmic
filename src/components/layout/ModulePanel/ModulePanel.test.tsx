import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ModulePanel } from "./ModulePanel";

describe("<ModulePanel />", () => {
  // TEST 1 — Renderiza el contenido pasado como children
  it("debería renderizar el contenido de los children en el área de contenido", () => {
    render(
      <ModulePanel label="TEST">
        <div>Contenido del módulo</div>
      </ModulePanel>
    );
    expect(screen.getByText("Contenido del módulo")).toBeInTheDocument();
  });

  // TEST 2 — El label siempre aparece en el footer
  it("debería renderizar el label en el footer del módulo", () => {
    render(
      <ModulePanel label="WAVEFORMS">
        <div>contenido</div>
      </ModulePanel>
    );
    expect(screen.getByText("WAVEFORMS")).toBeInTheDocument();
  });

  // TEST 3 — El footer tiene el mismo contenedor en todos los módulos
  it("debería tener un footer con la clase module-panel__footer", () => {
    const { container } = render(
      <ModulePanel label="ENVELOPE">
        <div>contenido</div>
      </ModulePanel>
    );
    const footer = container.querySelector(".module-panel__footer");
    expect(footer).toBeInTheDocument();
    expect(footer?.textContent).toBe("ENVELOPE");
  });

  // TEST 4 — El área de contenido tiene la clase correcta
  it("debería envolver los children en module-panel__content", () => {
    render(
      <ModulePanel label="EQ">
        <div data-testid="inner">inner</div>
      </ModulePanel>
    );
    const inner = screen.getByTestId("inner");
    expect(inner.parentElement).toHaveClass("module-panel__content");
  });
});
