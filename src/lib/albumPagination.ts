/** Recuerdos que se muestran al abrir el álbum y que agrega cada «Ver más». */
export const ALBUM_PAGE_SIZE = 20;

/** Recuerdos visibles tras pulsar «Ver más» cierto número de veces. */
export function revealAlbum<T>(files: readonly T[], visible: number) {
  const count = Math.min(Math.max(0, visible), files.length);
  return { files: files.slice(0, count), remaining: files.length - count };
}

export function nextVisibleCount(visible: number, total: number) {
  return Math.min(total, visible + ALBUM_PAGE_SIZE);
}
