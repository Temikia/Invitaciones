export type AlbumFile = { id: string; name: string; type: string; mediaUrl: string; thumbUrl?: string };
/** Lado mayor de la miniatura: debe coincidir con los tamaños que acepta `api/drive/gallery/thumb.js`. */
export type ThumbSize = 480 | 960 | 1920;
export type AlbumFilter = "all" | "photos" | "videos";
export type MosaicTile = "" | "big" | "tall" | "wide";

/** Duración de cada foto de la portada y de cada recuerdo en el modo película. */
export const HERO_SLIDE_MS = 4000;
export const MOVIE_SLIDE_MS = 5000;

/** Fisher–Yates sin modificar la lista recibida. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

/** Miniatura generada por Drive; sin ella se usa el original. */
export function thumbSrc(file: AlbumFile, size: ThumbSize) {
  return file.thumbUrl ? `${file.thumbUrl}&size=${size}` : file.mediaUrl;
}

export const isVideo = (file: { type: string }) => file.type.startsWith("video/");

export function filterAlbum<T extends { type: string }>(files: readonly T[], filter: AlbumFilter): T[] {
  if (filter === "photos") return files.filter((file) => !isVideo(file));
  if (filter === "videos") return files.filter(isVideo);
  return [...files];
}

/** Patrón de 12 cuadros; la cuadrícula usa `grid-auto-flow: dense` para no dejar huecos. */
const MOSAIC_PATTERN: MosaicTile[] = ["big", "", "", "tall", "", "", "", "wide", "", "", "big", ""];

export function mosaicTile(index: number): MosaicTile {
  return MOSAIC_PATTERN[index % MOSAIC_PATTERN.length];
}
