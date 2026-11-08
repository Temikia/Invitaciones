/**
 * Capas del visor del álbum: el recuerdo saliente queda debajo, tal como se veía, mientras el
 * nuevo aparece encima con un fundido.
 */

/**
 * Capa que debe quedar debajo al cambiar de recuerdo: la que se ve. Si la actual todavía no
 * aparece (se cambió rápido, antes de que cargara), sigue debajo la anterior; así nunca queda
 * debajo una capa invisible y la foto que se veía no desaparece de golpe.
 */
export function leavingLayer<T>(previous: T | null, current: T | null, currentVisible: boolean): T | null {
  return currentVisible ? current : previous;
}

/**
 * Orden de pintado en una sola lista con claves estables: la saliente debajo y la actual encima.
 * Al estar en la misma lista, React conserva el nodo de la capa que pasa de actual a saliente y
 * la imagen no se vuelve a crear ni a decodificar (eso provocaba un parpadeo).
 */
export function stageLayers<T extends { key: string }>(leaving: T | null, current: T | null): { layer: T; leaving: boolean }[] {
  const layers: { layer: T; leaving: boolean }[] = [];
  if (leaving && leaving.key !== current?.key) layers.push({ layer: leaving, leaving: true });
  if (current) layers.push({ layer: current, leaving: false });
  return layers;
}
