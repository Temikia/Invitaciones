import { describe, expect, it } from "vitest";
import { filterAlbum, mosaicTile, shuffle } from "./albumShow";

const sequence = (...values: number[]) => {
  let index = 0;
  return () => values[index++ % values.length];
};

describe("orden aleatorio del álbum", () => {
  it("conserva todos los recuerdos sin repetir ni modificar la lista original", () => {
    const files = Array.from({ length: 30 }, (_, index) => index);
    const copy = [...files];
    const shuffled = shuffle(files, sequence(0.9, 0.1, 0.5, 0.3, 0.7));
    expect(files).toEqual(copy);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(files);
    expect(shuffled).not.toEqual(files);
  });
});

describe("filtros del álbum", () => {
  const files = [{ type: "image/jpeg" }, { type: "video/mp4" }, { type: "image/webp" }];
  it("separa fotos y videos", () => {
    expect(filterAlbum(files, "all")).toHaveLength(3);
    expect(filterAlbum(files, "photos").map((file) => file.type)).toEqual(["image/jpeg", "image/webp"]);
    expect(filterAlbum(files, "videos").map((file) => file.type)).toEqual(["video/mp4"]);
  });
});

describe("mosaico", () => {
  it("repite un patrón de tamaños con mayoría de cuadros sencillos", () => {
    const tiles = Array.from({ length: 24 }, (_, index) => mosaicTile(index));
    expect(tiles.slice(0, 12)).toEqual(tiles.slice(12));
    expect(tiles[0]).toBe("big");
    expect(tiles.filter((tile) => tile === "").length).toBeGreaterThan(12);
  });
});
