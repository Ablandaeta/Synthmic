import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EqPlaceholder } from "./EqPlaceholder";

describe("<EqPlaceholder />", () => {
  // TEST 1 — Renderizado: la sección EQ es visible
  it("debería renderizar el label 'EQ'", () => {
    render(<EqPlaceholder />);
    expect(screen.getByText("EQ")).toBeInTheDocument();
  });

  // TEST 2 — Indica que el módulo está pendiente de implementación
  it("debería mostrar un indicador de 'coming soon'", () => {
    render(<EqPlaceholder />);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });
});
