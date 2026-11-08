import { describe, expect, it } from "vitest";
import { VIEWER_ZOOM_MAX, VIEWER_ZOOM_MIN, clampPan, clampZoom, swipeStep } from "./albumZoom";

describe("zoom del visor", () => {
  it("nunca baja de 100 % ni pasa del máximo", () => {
    expect(clampZoom(0.5)).toBe(VIEWER_ZOOM_MIN);
    expect(VIEWER_ZOOM_MIN).toBe(1);
    expect(clampZoom(2)).toBe(2);
    expect(clampZoom(99)).toBe(VIEWER_ZOOM_MAX);
  });
});

describe("arrastre de la foto ampliada", () => {
  const box = { imageWidth: 800, imageHeight: 600, stageWidth: 1000, stageHeight: 600 };

  it("sin zoom la foto queda centrada", () => {
    expect(clampPan({ x: 120, y: -80 }, { ...box, zoom: 1, rotation: 0 })).toEqual({ x: 0, y: 0 });
  });

  it("no deja que el borde de la foto entre en el escenario", () => {
    // Al 200 %: 1600 × 1200 en un escenario de 1000 × 600 → hasta 300 px a los lados y 300 px arriba/abajo.
    expect(clampPan({ x: 999, y: -999 }, { ...box, zoom: 2, rotation: 0 })).toEqual({ x: 300, y: -300 });
    expect(clampPan({ x: 100, y: 50 }, { ...box, zoom: 2, rotation: 0 })).toEqual({ x: 100, y: 50 });
  });

  it("con la foto girada intercambia ancho y alto", () => {
    // Girada: 600 × 800 → al 200 %, 1200 × 1600: hasta 100 px a los lados y 500 px arriba/abajo.
    expect(clampPan({ x: 999, y: 999 }, { ...box, zoom: 2, rotation: 90 })).toEqual({ x: 100, y: 500 });
  });
});

describe("deslizar para cambiar de recuerdo", () => {
  it("a la izquierda avanza y a la derecha retrocede", () => {
    expect(swipeStep(-90, 10)).toBe(1);
    expect(swipeStep(90, -10)).toBe(-1);
  });

  it("ignora movimientos cortos o mayormente verticales", () => {
    expect(swipeStep(-30, 0)).toBe(0);
    expect(swipeStep(-80, 120)).toBe(0);
  });
});
