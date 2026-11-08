import { useEffect, useReducer, useRef, useState, type AnimationEvent, type CSSProperties, type RefObject } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Pause, X } from "lucide-react";
import { useLanguage } from "../../config/language";
import { usePageVisible } from "../../hooks/useReducedMotion";
import { MOVIE_FADE_MS, MOVIE_SLIDE_MS, isVideo, movieMotion, shuffle, thumbSrc, whenDecoded, type AlbumFile } from "../../lib/albumShow";
import { currentSlide, initialMovieState, isCurrentReady, movieReducer, upcomingSlide, type MovieSlide as Slide } from "../../lib/albumMovie";
import "../../styles/album-movie.css";

type AlbumMovieProps = { files: AlbumFile[]; open: boolean; onClose: () => void };

/** Si un recuerdo no logra mostrarse en este tiempo, la película continúa con el siguiente. */
const STALL_LIMIT_MS = 15000;

/** Tras este tiempo sin mover el ratón, los controles de arriba se ocultan (solo con ratón; en pantallas táctiles siempre se ven). */
const CONTROLS_IDLE_MS = 2500;

type SlideProps = {
  slide: Slide;
  /** Visible con su fundido de entrada; sin esta marca la capa es transparente. */
  shown: boolean;
  /** Foto siguiente montada oculta debajo de todo mientras carga y se decodifica. */
  preload: boolean;
  /** Avisan por la clave de la propia capa: no importa si la capa era la precargada o la actual. */
  onReady: (key: string) => void;
  onFailed: (key: string) => void;
  /** Terminó el fundido de entrada: la capa de debajo ya puede retirarse. */
  onFaded: (key: string) => void;
  videoRef?: RefObject<HTMLVideoElement | null>;
  onWaiting?: (key: string) => void;
  /** Un video más corto que el recuerdo terminó antes que su tiempo. */
  onEnded?: () => void;
};

/**
 * Una capa de la película: la foto completa sobre una copia desenfocada que llena la pantalla, para
 * que una foto vertical en pantalla horizontal (o una horizontal en teléfono) no deje bandas negras.
 * La foto vive en un marco fijo con su misma proporción: el acercamiento y el alejamiento ocurren
 * dentro del marco, que nunca cambia de tamaño ni de lugar.
 */
function MovieSlide({ slide, shown, preload, onReady, onFailed, onFaded, videoRef, onWaiting, onEnded }: SlideProps) {
  const { file, key } = slide;
  const [ratio, setRatio] = useState(0);
  const photo = useRef<HTMLImageElement>(null);
  const reported = useRef(false);
  const reportReady = (image: HTMLImageElement) => {
    if (reported.current) return;
    reported.current = true;
    if (image.naturalWidth && image.naturalHeight) setRatio(image.naturalWidth / image.naturalHeight);
    // Se espera a que la foto esté decodificada: así el fundido arranca sin tirón ni cuadro vacío.
    void whenDecoded(image).then(() => onReady(key));
  };
  // Una foto en caché puede terminar de cargar antes de que React escuche `load`.
  useEffect(() => {
    const image = photo.current;
    if (image?.complete && image.naturalWidth) reportReady(image);
  }, []);
  const video = isVideo(file);
  const photoSrc = thumbSrc(file, 1920);
  // La foto reutiliza la misma miniatura (ya en caché); el video usa su póster pequeño, si existe.
  const backdropSrc = video ? (file.thumbUrl ? thumbSrc(file, 480) : undefined) : photoSrc;
  // Se espera al final real del fundido y no a un temporizador: si el navegador tarda en pintar
  // (teléfonos modestos, desenfoque pesado), quitar antes la capa de debajo dejaría ver el negro.
  const onAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.animationName === "album-movie-fade-in") onFaded(key);
  };
  return <div className={`album-movie-slide${shown ? " is-ready" : ""}${preload ? " is-preload" : ""}`} aria-hidden="true" onAnimationEnd={onAnimationEnd}>
    {backdropSrc && <img className="album-movie-backdrop" src={backdropSrc} alt="" />}
    {video
      ? <video ref={videoRef} src={file.mediaUrl} poster={file.thumbUrl ? photoSrc : undefined} muted playsInline autoPlay preload="auto"
        onPlaying={() => onReady(key)} onWaiting={() => onWaiting?.(key)} onEnded={() => onEnded?.()} onError={() => onFailed(key)} />
      : <div className={`album-movie-frame${ratio ? " has-ratio" : ""}`} style={ratio ? { "--ratio": ratio } as CSSProperties : undefined}>
        <img ref={photo} className={`album-movie-photo motion-${movieMotion(slide.step)}`} src={photoSrc} alt=""
          onLoad={(event) => reportReady(event.currentTarget)} onError={() => onFailed(key)} />
      </div>}
  </div>;
}

/**
 * Presentación a pantalla completa de todo el álbum en orden aleatorio.
 * Cada foto dura MOVIE_SLIDE_MS; cada video se reproduce sin sonido solo durante ese mismo tiempo.
 * El avance lo marca un reloj invisible (una animación CSS sin nada visible en pantalla), que corre
 * solo mientras el recuerdo actual ya se ve: se detiene si aún carga, si el video se queda sin
 * datos, con la pestaña oculta o con la barra espaciadora. Entre recuerdos hay un fundido cruzado sobre el que se estaba viendo. La foto
 * siguiente se monta oculta en cuanto la actual aparece. La lógica vive en `lib/albumMovie.ts`.
 * Al abrir se intenta la pantalla completa; el botón junto a la X (o la tecla F) entra y sale de ella
 * sin cerrar la película. Donde el navegador no la permite (iPhone), el botón no aparece.
 * La pantalla completa se pide para el contenedor interior y no para el `<dialog>`: los navegadores
 * rechazan un diálogo («Dialog elements are invalid»).
 */
export function AlbumMovie({ files, open, onClose }: AlbumMovieProps) {
  const { language } = useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canFullscreen] = useState(() => typeof document !== "undefined" && Boolean(document.fullscreenEnabled));
  const [fullscreen, setFullscreen] = useState(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const filesRef = useRef(files);
  filesRef.current = files;
  const pageVisible = usePageVisible();
  const [state, dispatch] = useReducer(movieReducer, initialMovieState);
  const [bufferingKey, setBufferingKey] = useState("");
  const [userPaused, setUserPaused] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const idleTimer = useRef(0);

  const slide = currentSlide(state);
  const slideKey = slide?.key ?? "";
  const ready = isCurrentReady(state);
  const upcoming = open ? upcomingSlide(state) : null;
  const paused = userPaused || !pageVisible || !ready || bufferingKey === slideKey;

  const advance = (direction: 1 | -1) => dispatch({ type: "advance", direction, reshuffle: () => shuffle(filesRef.current) });
  const markReady = (key: string) => {
    dispatch({ type: "ready", key });
    setBufferingKey((value) => (value === key ? "" : value));
  };
  const markFailed = (key: string) => dispatch({ type: "failed", key });
  const markFaded = (key: string) => dispatch({ type: "faded", key });

  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dispatch({ type: "start", queue: shuffle(filesRef.current) });
    setUserPaused(false);
    setBufferingKey("");
    if (!element.open) element.showModal();
    // Salir de la pantalla completa (botón, tecla F o Esc) ya no cierra la película: solo cambia el icono.
    const onFullscreenChange = () => setFullscreen(Boolean(screen.current) && document.fullscreenElement === screen.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    // Puede negarse (sin permiso o sin soporte); la película sigue en la ventana y queda el botón.
    screen.current?.requestFullscreen?.().catch(() => undefined);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      setFullscreen(false);
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
      if (element.open) element.close();
      // Así, al volver a abrir no se pinta ni un cuadro de la sesión anterior.
      dispatch({ type: "start", queue: [] });
      previousFocus?.focus();
    };
    // La baraja se arma al abrir; los cambios del listado durante la película no la reinician.
  }, [open]);

  // Un recuerdo que falló (o que no aparece a tiempo) se salta.
  const failed = Boolean(slideKey) && state.failed.includes(slideKey);
  useEffect(() => {
    if (!open || !slideKey || (ready && !failed)) return;
    const timer = window.setTimeout(() => advance(1), failed ? 0 : STALL_LIMIT_MS);
    return () => window.clearTimeout(timer);
  }, [open, slideKey, ready, failed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (userPaused || !pageVisible) video.pause();
    else void video.play().catch(() => undefined);
  }, [userPaused, pageVisible, slideKey]);

  const toggleFullscreen = () => {
    const element = screen.current;
    if (!element) return;
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    else void element.requestFullscreen?.().catch((error: unknown) => console.warn("La película no pudo entrar a pantalla completa.", error));
  };

  // Los controles aparecen al mover el ratón y se oculta tras un rato quieto.
  const revealControls = () => {
    setControlsVisible(true);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setControlsVisible(false), CONTROLS_IDLE_MS);
  };
  useEffect(() => {
    if (!open) return;
    revealControls();
    return () => window.clearTimeout(idleTimer.current);
  }, [open]);

  const onClockEnd = (event: AnimationEvent<HTMLElement>) => {
    if (event.target === event.currentTarget && event.animationName === "album-movie-fill") advance(1);
  };

  // Orden fijo de capas: la que se desvanece, la actual y la precargada. Al avanzar, la precargada
  // pasa a ser la actual sin moverse en el DOM, así no se reinicia su carga ni su movimiento.
  const layers: Slide[] = [];
  if (state.behind && state.behind.key !== slideKey) layers.push(state.behind);
  if (slide) layers.push(slide);
  if (upcoming && upcoming.key !== slideKey) layers.push(upcoming);
  const style = { "--movie-slide": `${MOVIE_SLIDE_MS}ms`, "--movie-fade": `${MOVIE_FADE_MS}ms` } as CSSProperties;
  return <dialog ref={dialog} className={`album-movie${paused ? " is-paused" : ""}${controlsVisible ? " show-controls" : ""}`} style={style}
    onMouseMove={revealControls}
    aria-label={language === "en" ? "Album movie" : "Película del álbum"}
    onCancel={(event) => { event.preventDefault(); closeRef.current(); }}
    onKeyDown={(event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); advance(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); advance(-1); }
      if (event.key === " ") { event.preventDefault(); setUserPaused((value) => !value); }
      if ((event.key === "f" || event.key === "F") && canFullscreen && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); toggleFullscreen(); }
    }}>
    <div ref={screen} className="album-movie-screen">{open && slide && <>
      <div className="album-movie-stage">
        {layers.map((layer) => {
          const active = layer.key === slideKey;
          const preload = layer.key === upcoming?.key;
          return <MovieSlide key={layer.key} slide={layer} shown={active ? ready : !preload} preload={preload}
            onReady={markReady} onFailed={markFailed} onFaded={markFaded}
            videoRef={active ? videoRef : undefined} onWaiting={active ? setBufferingKey : undefined}
            onEnded={active ? () => advance(1) : undefined} />;
        })}
      </div>
      <div className="album-movie-top">
        <p><span>{language === "en" ? "Camila's XV" : "Mis XV · Camila"}</span> {state.position + 1} / {state.queue.length}</p>
        <div className="album-movie-actions">
          {canFullscreen && <button type="button" className="album-movie-action" onClick={toggleFullscreen}
            aria-label={fullscreen ? (language === "en" ? "Exit full screen" : "Salir de pantalla completa") : (language === "en" ? "Full screen" : "Pantalla completa")}>
            {fullscreen ? <Minimize size={24} strokeWidth={1.75} aria-hidden="true" /> : <Maximize size={24} strokeWidth={1.75} aria-hidden="true" />}
          </button>}
          <button type="button" className="album-movie-action" onClick={onClose} aria-label={language === "en" ? "Close movie" : "Cerrar película"} autoFocus><X size={30} strokeWidth={1.75} aria-hidden="true" /></button>
        </div>
      </div>
      <button type="button" className="album-movie-zone is-prev" onClick={() => advance(-1)} aria-label={language === "en" ? "Previous memory" : "Recuerdo anterior"}><ChevronLeft size={30} aria-hidden="true" /></button>
      <button type="button" className="album-movie-zone is-next" onClick={() => advance(1)} aria-label={language === "en" ? "Next memory" : "Recuerdo siguiente"}><ChevronRight size={30} aria-hidden="true" /></button>
      {userPaused && <div className="album-movie-paused" role="status"><Pause size={18} aria-hidden="true" /> {language === "en" ? "Paused · press space to continue" : "En pausa · barra espaciadora para continuar"}</div>}
      {/* Reloj invisible: su animación dura lo que un recuerdo y, al terminar, pasa al siguiente. */}
      <span className="album-movie-clock" key={slideKey} aria-hidden="true" onAnimationEnd={onClockEnd} />
    </>}</div>
  </dialog>;
}
