/** Zoom del visor de recuerdos: 100 % es la foto completa; nunca se aleja más. */
export const VIEWER_ZOOM_MIN = 1;
export const VIEWER_ZOOM_MAX = 4;
export const VIEWER_ZOOM_STEP = 0.5;
/** Distancia horizontal mínima, en px, para que deslizar cambie de recuerdo. */
export const SWIPE_THRESHOLD = 60;

export type Pan = { x: number; y: number };
export type PanBox = {
  /** Tamaño de la foto en pantalla al 100 %, sin girar. */
  imageWidth: number;
  imageHeight: number;
  stageWidth: number;
  stageHeight: number;
  zoom: number;
  rotation: number;
};

export function clampZoom(zoom: number) {
  return Math.min(VIEWER_ZOOM_MAX, Math.max(VIEWER_ZOOM_MIN, zoom));
}

/** Desplazamiento permitido para que el borde de la foto ampliada nunca entre en el escenario. */
export function clampPan(pan: Pan, box: PanBox): Pan {
  const turned = Math.abs(box.rotation) % 180 === 90;
  const width = (turned ? box.imageHeight : box.imageWidth) * box.zoom;
  const height = (turned ? box.imageWidth : box.imageHeight) * box.zoom;
  const limitX = Math.max(0, (width - box.stageWidth) / 2);
  const limitY = Math.max(0, (height - box.stageHeight) / 2);
  const clamp = (value: number, limit: number) => (limit ? Math.min(limit, Math.max(-limit, value)) : 0);
  return { x: clamp(pan.x, limitX), y: clamp(pan.y, limitY) };
}

/** 1 = siguiente (deslizar a la izquierda), -1 = anterior, 0 = no cuenta como deslizar. */
export function swipeStep(dx: number, dy: number, threshold = SWIPE_THRESHOLD): -1 | 0 | 1 {
  if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return 0;
  return dx < 0 ? 1 : -1;
}
