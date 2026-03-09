import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Rack } from "./Rack";

describe("<Rack />", () => {
  it("debería renderizar sus hijos dentro de contenedores de módulos", () => {
    render(
      <Rack>
        <div data-testid="module-a">Modulo A</div>
        <div data-testid="module-b">Modulo B</div>
      </Rack>
    );

    expect(screen.getByTestId("module-a")).toBeInTheDocument();
    expect(screen.getByTestId("module-b")).toBeInTheDocument();
    
    // Verificamos que están envueltos por la clase rack-module
    expect(screen.getByTestId("module-a").parentElement).toHaveClass("rack-module");
    expect(screen.getByTestId("module-b").parentElement).toHaveClass("rack-module");
  });

  it("debería renderizar el espacio en blanco al final", () => {
    render(<Rack><div /></Rack>);
    expect(screen.getByText(/\+ Future FX Chain/i)).toBeInTheDocument();
  });

  it("debería ignorar hijos nulos", () => {
    const { container } = render(
      <Rack>
        <div>Modulo</div>
        {null}
      </Rack>
    );
    
    // Debería haber un div.rack-module para el primer hijo y uno fijo rack-blank-space
    const modules = container.querySelectorAll(".rack-module");
    expect(modules).toHaveLength(1);
  });
});
