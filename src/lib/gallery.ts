/** Posiciones de la baraja circular, sin limitar el álbum a cinco fotografías. */
export function galleryCardState(index: number, active: number, total: number) {
  const offset = (index - active + total) % total;
  if (offset === 0) return "active";
  if (offset === 1) return "next";
  if (offset === total - 1) return "prev";
  if (offset === 2) return "far-next";
  if (offset === total - 2) return "far-prev";
  return "hidden";
}
