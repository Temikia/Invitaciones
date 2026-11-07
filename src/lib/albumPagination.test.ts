import { describe, expect, it } from "vitest";
import { paginateAlbum } from "./albumPagination";

describe("paginación del álbum", () => {
  it("reparte 101 recuerdos sin repetir ni omitir archivos", () => {
    const files = Array.from({ length: 101 }, (_, index) => index);
    const pages = [1, 2, 3].map((page) => paginateAlbum(files, page));
    expect(pages.map((page) => page.files.length)).toEqual([50, 50, 1]);
    expect(pages.flatMap((page) => page.files)).toEqual(files);
    expect(pages[0].pageCount).toBe(3);
  });
  it("mantiene la página dentro del rango si cambia la colección", () => {
    expect(paginateAlbum(["foto"], 4)).toEqual({ page: 1, pageCount: 1, files: ["foto"] });
    expect(paginateAlbum([], 0)).toEqual({ page: 1, pageCount: 1, files: [] });
  });
});
