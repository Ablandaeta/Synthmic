import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SynthChassis } from "./SynthChassis";

describe("<SynthChassis />", () => {
  it("debería renderizar los slots de header, rack y keyboard", () => {
    render(
      <SynthChassis
        header={<div data-testid="header">HEADER</div>}
        rack={<div data-testid="rack">RACK</div>}
        keyboard={<div data-testid="keyboard">KEYBOARD</div>}
        onWakeUp={() => {}}
      />
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("rack")).toBeInTheDocument();
    expect(screen.getByTestId("keyboard")).toBeInTheDocument();
  });

  it("debería llamar a onWakeUp al hacer mousedown en el chasis", () => {
    const onWakeUp = vi.fn();
    const { container } = render(
      <SynthChassis
        header={<div />}
        rack={<div />}
        keyboard={<div />}
        onWakeUp={onWakeUp}
      />
    );

    const chassis = container.firstChild as HTMLElement;
    fireEvent.mouseDown(chassis);
    
    expect(onWakeUp).toHaveBeenCalledTimes(1);
  });
});
