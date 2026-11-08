import { describe, expect, it } from "vitest";
import { ALBUM_PAGE_SIZE, nextVisibleCount, revealAlbum } from "./albumPagination";

describe("carga progresiva del álbum", () => {
  it("muestra 45 recuerdos en tandas de 20 sin repetir ni omitir archivos", () => {
    const files = Array.from({ length: 45 }, (_, index) => index);
    expect(ALBUM_PAGE_SIZE).toBe(20);
    let visible = ALBUM_PAGE_SIZE;
    const first = revealAlbum(files, visible);
    expect(first.files).toHaveLength(20);
    expect(first.remaining).toBe(25);
    visible = nextVisibleCount(visible, files.length);
    expect(revealAlbum(files, visible).files).toHaveLength(40);
    visible = nextVisibleCount(visible, files.length);
    const last = revealAlbum(files, visible);
    expect(last.files).toEqual(files);
    expect(last.remaining).toBe(0);
    expect(nextVisibleCount(visible, files.length)).toBe(45);
  });
  it("mantiene la cantidad dentro del rango si cambia la colección", () => {
    expect(revealAlbum(["foto"], 50)).toEqual({ files: ["foto"], remaining: 0 });
    expect(revealAlbum([], 0)).toEqual({ files: [], remaining: 0 });
    expect(revealAlbum([1, 2, 3], -4)).toEqual({ files: [], remaining: 3 });
  });
});
