import { describe, expect, it } from "vitest";
import { leavingLayer, stageLayers } from "./albumViewer";

const a = { key: "0:a" };
const b = { key: "1:b" };
const c = { key: "2:c" };

describe("leavingLayer", () => {
  it("deja debajo la capa actual cuando ya se ve", () => {
    expect(leavingLayer(null, a, true)).toBe(a);
  });

  it("con cambios rápidos conserva la capa que se veía, no la que aún no aparece", () => {
    // a se veía; se pasó a b y, antes de que b apareciera, a c.
    const first = leavingLayer(null, a, true);
    expect(leavingLayer(first, b, false)).toBe(a);
  });

  it("sin capa visible previa no deja nada debajo", () => {
    expect(leavingLayer(null, a, false)).toBeNull();
  });
});

describe("stageLayers", () => {
  it("pinta la saliente debajo y la actual encima", () => {
    expect(stageLayers(a, b)).toEqual([{ layer: a, leaving: true }, { layer: b, leaving: false }]);
  });

  it("conserva la clave de la capa al pasar de actual a saliente", () => {
    const before = stageLayers(null, b).map(({ layer }) => layer.key);
    const after = stageLayers(b, c).map(({ layer }) => layer.key);
    expect(before).toEqual(["1:b"]);
    expect(after).toEqual(["1:b", "2:c"]);
  });

  it("no duplica la capa si la saliente es la misma que la actual", () => {
    expect(stageLayers(a, a)).toEqual([{ layer: a, leaving: false }]);
  });

  it("sin recuerdo abierto no pinta nada", () => {
    expect(stageLayers(null, null)).toEqual([]);
  });
});
