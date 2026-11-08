import { useEffect, useRef, useState, type CSSProperties, type RefObject, type SyntheticEvent } from "react";
import { ChevronLeft, ChevronRight, Pause, X } from "lucide-react";
import { useLanguage } from "../../config/language";
import { usePageVisible } from "../../hooks/useReducedMotion";
import { MOVIE_FADE_MS, MOVIE_SLIDE_MS, isVideo, movieMotion, shuffle, thumbSrc, type AlbumFile } from "../../lib/albumShow";
import "../../styles/album-movie.css";

type AlbumMovieProps = { files: AlbumFile[]; open: boolean; onClose: () => void };

/** Si un recuerdo no logra mostrarse en este tiempo, la película continúa con el siguiente. */
const STALL_LIMIT_MS = 15000;

/** Recuerdo en pantalla; `key` cambia en cada avance aunque se repita el archivo. */
type Slide = { key: string; file: AlbumFile; step: number };

type SlideEvents = {
  videoRef: RefObject<HTMLVideoElement | null>;
  onReady: () => void;
  onWaiting: () => void;
  onSkip: () => void;
};

/**
 * Una capa de la película: la foto completa sobre una copia desenfocada que llena la pantalla, para
 * que una foto vertical en pantalla horizontal (o una horizontal en teléfono) no deje bandas negras.
 * La foto vive en un marco fijo con su misma proporción: el acercamiento y el alejamiento ocurren
 * dentro del marco, que nunca cambia de tamaño ni de lugar. La capa saliente se queda debajo, sin
 * eventos, mientras la nueva aparece.
 */
function MovieSlide({ slide, ready, events }: { slide: Slide; ready: boolean; events?: SlideEvents }) {
  const { file } = slide;
  const [ratio, setRatio] = useState(0);
  const onPhotoLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (naturalWidth && naturalHeight) setRatio(naturalWidth / naturalHeight);
    events?.onReady();
  };
  const video = isVideo(file);
  const photoSrc = thumbSrc(file, 1920);
  // La foto reutiliza la misma miniatura (ya en caché); el video usa su póster pequeño, si existe.
  const backdropSrc = video ? (file.thumbUrl ? thumbSrc(file, 480) : undefined) : photoSrc;
  return <div className={`album-movie-slide${ready ? " is-ready" : ""}`} aria-hidden="true">
    {backdropSrc && <img className="album-movie-backdrop" src={backdropSrc} alt="" />}
    {video
      ? <video ref={events?.videoRef} src={file.mediaUrl} poster={file.thumbUrl ? photoSrc : undefined} muted playsInline autoPlay preload="auto"
        onPlaying={events?.onReady} onWaiting={events?.onWaiting} onEnded={events?.onSkip} onError={events?.onSkip} />
      : <div className={`album-movie-frame${ratio ? " has-ratio" : ""}`} style={ratio ? { "--ratio": ratio } as CSSProperties : undefined}>
        <img className={`album-movie-photo motion-${movieMotion(slide.step)}`} src={photoSrc} alt=""
          onLoad={onPhotoLoad} onError={events?.onSkip} />
      </div>}
  </div>;
}

/**
 * Presentación a pantalla completa de todo el álbum en orden aleatorio.
 * Cada foto dura MOVIE_SLIDE_MS; cada video se reproduce sin sonido solo durante ese mismo tiempo.
 * El avance lo marca el final de la barra de progreso, que se detiene mientras el recuerdo carga,
 * la pestaña está oculta o se pulsa la barra espaciadora. Entre recuerdos hay un fundido cruzado:
 * el último que se mostró permanece debajo hasta que el nuevo termina de aparecer.
 */
export function AlbumMovie({ files, open, onClose }: AlbumMovieProps) {
  const { language } = useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const enteredFullscreen = useRef(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const pageVisible = usePageVisible();
  const [queue, setQueue] = useState<AlbumFile[]>([]);
  const [position, setPosition] = useState(0);
  const [step, setStep] = useState(0);
  const [readyKey, setReadyKey] = useState("");
  const [behind, setBehind] = useState<Slide | null>(null);
  const lastShown = useRef<Slide | null>(null);
  const [buffering, setBuffering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const current = queue[position];
  const slideKey = String(step);
  const slide: Slide | null = current ? { key: slideKey, file: current, step } : null;
  // Se compara la clave (no un booleano que se reinicia en un efecto) para que el recuerdo nuevo
  // nunca se pinte un instante como listo y el fundido siempre parta de transparente.
  const ready = readyKey === slideKey;
  const paused = userPaused || !pageVisible || buffering || !ready;

  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQueue(shuffle(files));
    setPosition(0);
    setStep(0);
    setReadyKey("");
    setBehind(null);
    lastShown.current = null;
    setUserPaused(false);
    if (!element.open) element.showModal();
    enteredFullscreen.current = false;
    element.requestFullscreen?.().then(() => { enteredFullscreen.current = true; }).catch(() => undefined);
    const onFullscreenChange = () => {
      if (enteredFullscreen.current && !document.fullscreenElement) closeRef.current();
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      enteredFullscreen.current = false;
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
      if (element.open) element.close();
      previousFocus?.focus();
    };
    // La baraja se arma al abrir; los cambios del listado durante la película no la reinician.
  }, [open]);

  useEffect(() => {
    setBuffering(false);
  }, [slideKey]);

  // Cuando el recuerdo nuevo ya se ve, la capa anterior se retira al terminar el fundido.
  useEffect(() => {
    if (!ready || !slide) return;
    lastShown.current = slide;
    const timer = window.setTimeout(() => setBehind(null), MOVIE_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [ready, slideKey]);

  useEffect(() => {
    if (!open || !current || ready) return;
    const timer = window.setTimeout(() => advance(1), STALL_LIMIT_MS);
    return () => window.clearTimeout(timer);
  }, [open, current, ready, slideKey]);

  useEffect(() => {
    const next = queue[position + 1];
    if (open && next && !isVideo(next)) new Image().src = thumbSrc(next, 1920);
  }, [open, queue, position]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (userPaused || !pageVisible) video.pause();
    else void video.play().catch(() => undefined);
  }, [userPaused, pageVisible, slideKey]);

  function advance(direction: number) {
    if (!queue.length) return;
    // En el mismo render que cambia de recuerdo, para que no quede ni un cuadro en negro.
    setBehind(lastShown.current);
    setStep((value) => value + 1);
    const next = position + direction;
    if (next >= queue.length) {
      setQueue(shuffle(files));
      setPosition(0);
    } else {
      setPosition((next + queue.length) % queue.length);
    }
  }

  const events: SlideEvents = {
    videoRef,
    onReady: () => { setReadyKey(slideKey); setBuffering(false); },
    onWaiting: () => setBuffering(true),
    onSkip: () => advance(1),
  };
  // La capa saliente va primero (debajo) y conserva su clave, así no se reinicia su movimiento.
  const layers = behind && slide && behind.key !== slide.key ? [behind, slide] : slide ? [slide] : [];
  const style = { "--movie-slide": `${MOVIE_SLIDE_MS}ms`, "--movie-fade": `${MOVIE_FADE_MS}ms` } as CSSProperties;
  return <dialog ref={dialog} className={`album-movie${paused ? " is-paused" : ""}`} style={style}
    aria-label={language === "en" ? "Album movie" : "Película del álbum"}
    onCancel={(event) => { event.preventDefault(); closeRef.current(); }}
    onKeyDown={(event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); advance(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); advance(-1); }
      if (event.key === " ") { event.preventDefault(); setUserPaused((value) => !value); }
    }}>
    {open && slide && <>
      <div className="album-movie-stage">
        {layers.map((layer) => {
          const active = layer.key === slide.key;
          return <MovieSlide key={layer.key} slide={layer} ready={active ? ready : true} events={active ? events : undefined} />;
        })}
      </div>
      <div className="album-movie-top">
        <p><span>{language === "en" ? "Camila's XV" : "Mis XV · Camila"}</span> {position + 1} / {queue.length}</p>
        <button type="button" onClick={onClose} aria-label={language === "en" ? "Close movie" : "Cerrar película"} autoFocus><X size={22} /></button>
      </div>
      <button type="button" className="album-movie-zone is-prev" onClick={() => advance(-1)} aria-label={language === "en" ? "Previous memory" : "Recuerdo anterior"}><ChevronLeft size={30} aria-hidden="true" /></button>
      <button type="button" className="album-movie-zone is-next" onClick={() => advance(1)} aria-label={language === "en" ? "Next memory" : "Recuerdo siguiente"}><ChevronRight size={30} aria-hidden="true" /></button>
      {userPaused && <div className="album-movie-paused" role="status"><Pause size={18} aria-hidden="true" /> {language === "en" ? "Paused · press space to continue" : "En pausa · barra espaciadora para continuar"}</div>}
      <div className="album-movie-progress" aria-hidden="true"><b key={slideKey} onAnimationEnd={() => advance(1)} /></div>
    </>}
  </dialog>;
}
