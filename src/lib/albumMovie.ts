import { isVideo, type AlbumFile } from "./albumShow";

/**
 * Estado del modo película como reductor puro, para probarlo sin navegador.
 *
 * Cada recuerdo en pantalla es una «diapositiva» con clave `paso:archivo`: el paso crece en cada
 * avance, así que la clave es única aunque el mismo archivo vuelva a salir en otra baraja.
 *
 * Regla central: estar listo (cargado y decodificado) es una propiedad de cada clave y nunca se
 * pierde. Antes había una sola «clave precargada» que la foto siguiente sobrescribía; la foto en
 * pantalla, que ya había disparado `load` mientras esperaba oculta, dejaba de estar lista, la barra
 * se congelaba y reaparecía la foto anterior hasta que el límite de espera forzaba el salto.
 */
export type MovieSlide = { key: string; file: AlbumFile; step: number };

export type MovieState = {
  queue: AlbumFile[];
  position: number;
  step: number;
  /** Claves listas para verse (solo las más recientes; las viejas ya no están montadas). */
  ready: string[];
  /** Claves que no lograron cargar; la película las salta al llegar a ellas. */
  failed: string[];
  /** Recuerdo que se desvanece debajo del actual durante el fundido. */
  behind: MovieSlide | null;
};

export type MovieAction =
  | { type: "start"; queue: AlbumFile[] }
  | { type: "ready"; key: string }
  | { type: "failed"; key: string }
  /** `reshuffle` arma la baraja siguiente; solo se llama al terminar la actual. */
  | { type: "advance"; direction: 1 | -1; reshuffle: () => AlbumFile[] }
  /** El fundido del recuerdo `key` terminó: la capa de debajo ya no se ve. */
  | { type: "faded"; key: string };

const KEPT_KEYS = 8;

export const initialMovieState: MovieState = { queue: [], position: 0, step: 0, ready: [], failed: [], behind: null };

const slideAt = (queue: AlbumFile[], position: number, step: number): MovieSlide | null => {
  const file = queue[position];
  return file ? { key: `${step}:${file.id}`, file, step } : null;
};

export const currentSlide = (state: MovieState) => slideAt(state.queue, state.position, state.step);

export function isCurrentReady(state: MovieState) {
  const slide = currentSlide(state);
  return Boolean(slide && state.ready.includes(slide.key));
}

/**
 * Foto siguiente, que se monta oculta en cuanto la actual se ve para que al avanzar ya esté
 * decodificada. Los videos y el paso a una baraja nueva no se precargan.
 */
export function upcomingSlide(state: MovieState): MovieSlide | null {
  if (!isCurrentReady(state)) return null;
  const slide = slideAt(state.queue, state.position + 1, state.step + 1);
  return slide && !isVideo(slide.file) ? slide : null;
}

const remember = (keys: string[], key: string) => (keys.includes(key) ? keys : [...keys, key].slice(-KEPT_KEYS));

export function movieReducer(state: MovieState, action: MovieAction): MovieState {
  switch (action.type) {
    case "start":
      return { ...initialMovieState, queue: action.queue };
    case "ready":
      return { ...state, ready: remember(state.ready, action.key) };
    case "failed":
      return { ...state, failed: remember(state.failed, action.key) };
    case "faded":
      return currentSlide(state)?.key === action.key && isCurrentReady(state) ? { ...state, behind: null } : state;
    case "advance": {
      const length = state.queue.length;
      if (!length) return state;
      // Queda debajo lo que se estaba viendo: el actual si ya terminó de aparecer; si aún carga o
      // está a medio fundido (al saltar rápido), la capa que seguía debajo, que se ve completa.
      const behind = state.behind ?? (isCurrentReady(state) ? currentSlide(state) : null);
      const target = state.position + action.direction;
      const wraps = target >= length;
      return {
        ...state,
        queue: wraps ? action.reshuffle() : state.queue,
        position: wraps ? 0 : (target + length) % length,
        step: state.step + 1,
        behind,
      };
    }
  }
}
