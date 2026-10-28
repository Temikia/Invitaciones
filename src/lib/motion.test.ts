import { describe, expect, it } from "vitest";
import { resolveMotionMode } from "./motion";

describe("ambiente de la invitación", () => {
  it("ofrece efectos suaves en lugar de una página estática cuando el sistema reduce movimiento", () => {
    expect(resolveMotionMode(null, true)).toBe("gentle");
    expect(resolveMotionMode(null, false)).toBe("full");
  });
  it("respeta la elección de la página sin exigir cambios al teléfono", () => {
    for (const reduced of [true, false]) {
      expect(resolveMotionMode("full", reduced)).toBe("full");
      expect(resolveMotionMode("gentle", reduced)).toBe("gentle");
      expect(resolveMotionMode("paused", reduced)).toBe("paused");
    }
  });
  it("descarta preferencias guardadas inválidas", () => {
    expect(resolveMotionMode("valor-antiguo", true)).toBe("gentle");
    expect(resolveMotionMode("", false)).toBe("full");
  });
});
