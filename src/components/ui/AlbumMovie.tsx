import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Pause, X } from "lucide-react";
import { useLanguage } from "../../config/language";
import { usePageVisible } from "../../hooks/useReducedMotion";
import { MOVIE_SLIDE_MS, isVideo, shuffle, type AlbumFile } from "../../lib/albumShow";
import "../../styles/album-movie.css";

type AlbumMovieProps = { files: AlbumFile[]; open: boolean; onClose: () => void };

/** Si un recuerdo no logra mostrarse en este tiempo, la película continúa con el siguiente. */
const STALL_LIMIT_MS = 15000;

/**
 * Presentación a pantalla completa de todo el álbum en orden aleatorio.
 * Cada foto dura MOVIE_SLIDE_MS; cada video se reproduce sin sonido solo durante ese mismo tiempo.
 * El avance lo marca el final de la barra de progreso, que se detiene mientras el recuerdo carga,
 * la pestaña está oculta o se pulsa la barra espaciadora.
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
  const [round, setRound] = useState(0);
  const [ready, setReady] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const current = queue[position];
  const paused = userPaused || !pageVisible || buffering || !ready;
  const slideKey = `${round}-${position}`;

  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQueue(shuffle(files));
    setPosition(0);
    setRound(0);
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
    setReady(false);
    setBuffering(false);
  }, [slideKey]);

  useEffect(() => {
    if (!open || !current || ready) return;
    const timer = window.setTimeout(() => advance(1), STALL_LIMIT_MS);
    return () => window.clearTimeout(timer);
  }, [open, current, ready, slideKey]);

  useEffect(() => {
    const next = queue[position + 1];
    if (open && next && !isVideo(next)) new Image().src = next.mediaUrl;
  }, [open, queue, position]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (userPaused || !pageVisible) video.pause();
    else void video.play().catch(() => undefined);
  }, [userPaused, pageVisible, slideKey]);

  function advance(step: number) {
    if (!queue.length) return;
    const next = position + step;
    if (next >= queue.length) {
      setQueue(shuffle(files));
      setPosition(0);
      setRound((value) => value + 1);
    } else {
      setPosition((next + queue.length) % queue.length);
    }
  }

  const style = { "--movie-slide": `${MOVIE_SLIDE_MS}ms` } as CSSProperties;
  return <dialog ref={dialog} className={`album-movie${paused ? " is-paused" : ""}`} style={style}
    aria-label={language === "en" ? "Album movie" : "Película del álbum"}
    onCancel={(event) => { event.preventDefault(); closeRef.current(); }}
    onKeyDown={(event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); advance(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); advance(-1); }
      if (event.key === " ") { event.preventDefault(); setUserPaused((value) => !value); }
    }}>
    {open && current && <>
      <div className="album-movie-stage" key={slideKey}>
        {isVideo(current)
          ? <video ref={videoRef} src={current.mediaUrl} muted playsInline autoPlay preload="auto"
            onPlaying={() => { setReady(true); setBuffering(false); }} onWaiting={() => setBuffering(true)}
            onEnded={() => advance(1)} onError={() => advance(1)} aria-hidden="true" />
          : <img src={current.mediaUrl} alt="" className={position % 2 ? "drift-left" : "drift-right"}
            onLoad={() => setReady(true)} onError={() => advance(1)} />}
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
