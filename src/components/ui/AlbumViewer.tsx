import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type SyntheticEvent } from "react";
import { ChevronLeft, ChevronRight, RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useLanguage } from "../../config/language";
import { isVideo, thumbSrc, whenDecoded, type AlbumFile } from "../../lib/albumShow";
import { VIEWER_ZOOM_MAX, VIEWER_ZOOM_MIN, VIEWER_ZOOM_STEP, clampPan, clampZoom, swipeStep, type Pan } from "../../lib/albumZoom";
import "../../styles/album-viewer.css";

type AlbumViewerProps = {
  files: AlbumFile[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/** Duración del fundido entre un recuerdo y otro (debe coincidir con `--viewer-fade` en CSS). */
const VIEWER_FADE_MS = 320;
/** Dos toques en menos de este tiempo alternan entre 100 % y 200 %. */
const DOUBLE_TAP_MS = 300;
/** Franja inferior del video reservada a sus controles: ahí deslizar no cambia de recuerdo. */
const VIDEO_CONTROLS_PX = 64;

/** Recuerdo pintado en el escenario. El saliente conserva su transformación mientras el nuevo aparece. */
type Layer = { key: string; file: AlbumFile; transform?: string };
type Gesture = {
  /** pan: arrastrar la foto ampliada · swipe: deslizar con el dedo · pinch: pellizcar · tap: clic sin zoom (doble clic). */
  mode: "pan" | "swipe" | "pinch" | "tap";
  startX: number;
  startY: number;
  startPan: Pan;
  startZoom: number;
  startDistance: number;
  moved: boolean;
};

const ORIGIN: Pan = { x: 0, y: 0 };

/** All transforms affect presentation only; the original file is never changed. */
export function AlbumViewer({ files, index, onIndexChange, onClose }: AlbumViewerProps) {
  const { language } = useLanguage();
  const en = language === "en";
  const dialog = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState<Pan>(ORIGIN);
  const [swipeX, setSwipeX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState({ width: 0, height: 0 });
  const [readyKey, setReadyKey] = useState("");
  const [leaving, setLeaving] = useState<Layer | null>(null);
  const lastShown = useRef<Layer | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<Gesture | null>(null);
  const lastTap = useRef({ time: 0, x: 0, y: 0 });
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const file = index === null ? null : files[index] ?? null;
  const open = file !== null;
  const canNavigate = files.length > 1;
  const video = file ? isVideo(file) : false;
  const layerKey = file && index !== null ? `${index}:${file.id}` : "";
  // Los videos aparecen de inmediato (muestran su póster); las fotos, cuando ya están decodificadas.
  const ready = Boolean(layerKey) && (video || readyKey === layerKey);
  const turned = rotation % 180 !== 0;
  const transform = `translate3d(${pan.x + swipeX}px, ${pan.y}px, 0) rotate(${rotation}deg) scale(${zoom})`;

  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!element.open) element.showModal();
    return () => {
      if (element.open) element.close();
      setLeaving(null);
      lastShown.current = null;
      previousFocus?.focus();
    };
  }, [open]);

  // El escenario se mide para que la foto quepa completa al 100 %, también girada.
  useEffect(() => {
    const element = stageRef.current;
    if (!element || !open) return;
    const measure = () => setStage({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setPan(ORIGIN);
    setSwipeX(0);
    gesture.current = null;
    pointers.current.clear();
  }, [layerKey]);

  // Cuando el recuerdo nuevo ya se ve, el anterior se retira al terminar el fundido.
  useEffect(() => {
    if (!ready || !file) return;
    const timer = window.setTimeout(() => setLeaving(null), VIEWER_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [ready, layerKey]);

  // Se precargan y decodifican los vecinos para que el cambio sea inmediato.
  useEffect(() => {
    if (index === null || !canNavigate) return;
    for (const step of [1, -1]) {
      const neighbour = files[(index + step + files.length) % files.length];
      if (!neighbour || isVideo(neighbour)) continue;
      const image = new Image();
      image.src = thumbSrc(neighbour, 1920);
      void image.decode?.().catch(() => undefined);
    }
  }, [files, index, canNavigate]);

  lastShown.current = file ? { key: layerKey, file, transform } : null;

  const go = (step: number) => {
    if (index === null || !canNavigate) return;
    // El recuerdo actual se queda debajo, tal como se ve, mientras el siguiente aparece encima.
    setLeaving(lastShown.current);
    onIndexChange((index + step + files.length) % files.length);
  };

  /** Fotografía al 100 %, sin girar: la mayor que cabe en el escenario con su proporción. */
  const imageBox = () => ({
    imageWidth: imageRef.current?.offsetWidth ?? 0,
    imageHeight: imageRef.current?.offsetHeight ?? 0,
    stageWidth: stage.width,
    stageHeight: stage.height,
  });

  /** Cambia el zoom manteniendo fijo el punto indicado (relativo al centro del escenario). */
  const zoomTo = (target: number, point: Pan = ORIGIN, from = { zoom, pan }) => {
    const next = clampZoom(target);
    if (next === VIEWER_ZOOM_MIN) { setZoom(next); setPan(ORIGIN); return; }
    const factor = next / from.zoom;
    const moved = { x: point.x - (point.x - from.pan.x) * factor, y: point.y - (point.y - from.pan.y) * factor };
    setZoom(next);
    setPan(clampPan(moved, { ...imageBox(), zoom: next, rotation }));
  };

  const rotate = () => {
    const next = (rotation + 90) % 360;
    setRotation(next);
    setPan((value) => clampPan(value, { ...imageBox(), zoom, rotation: next }));
  };

  const stagePoint = (clientX: number, clientY: number): Pan => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return ORIGIN;
    return { x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2 };
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as Element;
    if (target.closest("button")) return;
    if (target instanceof HTMLVideoElement) {
      // En computadora el video se maneja con sus controles; con el dedo, se desliza fuera de su barra.
      if (event.pointerType === "mouse" || event.clientY > target.getBoundingClientRect().bottom - VIDEO_CONTROLS_PX) return;
    }
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    // Captura el puntero para seguir el gesto aunque salga del escenario; si el navegador no lo permite, se sigue sin captura.
    try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* sin captura */ }
    const points = [...pointers.current.values()];
    if (points.length === 2 && !video) {
      const [a, b] = points;
      gesture.current = { mode: "pinch", startX: (a.x + b.x) / 2, startY: (a.y + b.y) / 2, startPan: pan, startZoom: zoom,
        startDistance: Math.hypot(a.x - b.x, a.y - b.y) || 1, moved: true };
      setSwipeX(0);
      setDragging(true);
      return;
    }
    if (points.length > 1) return;
    const mode: Gesture["mode"] = !video && zoom > VIEWER_ZOOM_MIN ? "pan" : event.pointerType === "mouse" ? "tap" : "swipe";
    gesture.current = { mode, startX: event.clientX, startY: event.clientY, startPan: pan, startZoom: zoom, startDistance: 1, moved: false };
    if (mode !== "tap") setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const current = gesture.current;
    if (!current) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (Math.hypot(dx, dy) > 6) current.moved = true;
    if (current.mode === "pinch") {
      const [a, b] = [...pointers.current.values()];
      if (!a || !b) return;
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const center = stagePoint((a.x + b.x) / 2, (a.y + b.y) / 2);
      zoomTo(current.startZoom * (distance / current.startDistance), center, { zoom: current.startZoom, pan: current.startPan });
    } else if (current.mode === "pan") {
      setPan(clampPan({ x: current.startPan.x + dx, y: current.startPan.y + dy }, { ...imageBox(), zoom, rotation }));
    } else if (current.mode === "swipe" && canNavigate && Math.abs(dx) > Math.abs(dy)) {
      // La foto sigue al dedo, frenada, para que se note hacia dónde se va.
      setSwipeX(dx * 0.6);
    }
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.delete(event.pointerId);
    const current = gesture.current;
    if (!current) return;
    if (current.mode === "pinch") {
      // Al soltar un dedo se sigue arrastrando con el otro, si la foto quedó ampliada.
      const rest = [...pointers.current.values()][0];
      gesture.current = rest && zoom > VIEWER_ZOOM_MIN
        ? { mode: "pan", startX: rest.x, startY: rest.y, startPan: pan, startZoom: zoom, startDistance: 1, moved: true } : null;
      if (!gesture.current) setDragging(false);
      return;
    }
    gesture.current = null;
    setDragging(false);
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (current.mode === "swipe") {
      const step = event.type === "pointercancel" ? 0 : swipeStep(dx, dy);
      if (step && canNavigate) { go(step); return; }
      setSwipeX(0);
    }
    if (!current.moved && !video && event.type === "pointerup") {
      // Doble toque o doble clic: alterna entre la foto completa y 200 % en ese punto.
      const now = performance.now();
      const tap = lastTap.current;
      if (now - tap.time < DOUBLE_TAP_MS && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) < 30) {
        lastTap.current = { time: 0, x: 0, y: 0 };
        zoomTo(zoom > VIEWER_ZOOM_MIN ? VIEWER_ZOOM_MIN : 2, stagePoint(event.clientX, event.clientY));
      } else {
        lastTap.current = { time: now, x: event.clientX, y: event.clientY };
      }
    }
  };

  const onPhotoLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const key = layerKey;
    void whenDecoded(event.currentTarget).then(() => setReadyKey(key));
  };

  const fit = turned ? { maxWidth: stage.height, maxHeight: stage.width } : { maxWidth: stage.width, maxHeight: stage.height };
  const label = en ? "Memory viewer" : "Visor de recuerdos";
  const zoomPercent = Math.round(zoom * 100);
  const layers = leaving && leaving.key !== layerKey ? [leaving] : [];
  return <dialog ref={dialog} className="album-viewer" aria-label={label}
    style={{ "--viewer-fade": `${VIEWER_FADE_MS}ms` } as CSSProperties}
    onCancel={(event) => { event.preventDefault(); closeRef.current(); }}
    onClick={(event) => { if (event.target === event.currentTarget) closeRef.current(); }}
    onKeyDown={(event) => {
      if (event.target instanceof HTMLVideoElement) return;
      if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
      if (video) return;
      if (event.key === "+" || event.key === "=") { event.preventDefault(); zoomTo(zoom + VIEWER_ZOOM_STEP); }
      if (event.key === "-") { event.preventDefault(); zoomTo(zoom - VIEWER_ZOOM_STEP); }
      if (event.key === "0") { event.preventDefault(); zoomTo(VIEWER_ZOOM_MIN); }
    }}>
    {file && index !== null && <div className="album-viewer-panel">
      <div className="album-viewer-toolbar">
        {!video && <div className="album-viewer-tools" role="group" aria-label={en ? "Photo controls" : "Controles de fotografía"}>
          <button type="button" onClick={() => zoomTo(zoom - VIEWER_ZOOM_STEP)} disabled={zoom <= VIEWER_ZOOM_MIN} aria-label={en ? "Zoom out" : "Alejar"}><ZoomOut size={24} strokeWidth={1.75} /></button>
          <button type="button" onClick={() => zoomTo(zoom + VIEWER_ZOOM_STEP)} disabled={zoom >= VIEWER_ZOOM_MAX} aria-label={en ? "Zoom in" : "Acercar"}><ZoomIn size={24} strokeWidth={1.75} /></button>
          <button type="button" className="album-viewer-rotate" onClick={rotate} aria-label={en ? "Rotate photo clockwise" : "Girar fotografía a la derecha"}><RotateCw size={23} strokeWidth={1.75} /></button>
          <span className="sr-only" aria-live="polite">{en ? `Zoom ${zoomPercent}%` : `Zoom al ${zoomPercent} %`}</span>
        </div>}
        {canNavigate && <span className="album-viewer-count" aria-live="polite">{index + 1} / {files.length}</span>}
        <button type="button" className="album-viewer-close" onClick={onClose} aria-label={en ? "Close viewer" : "Cerrar visor"} autoFocus><X size={28} strokeWidth={1.75} /></button>
      </div>
      <div ref={stageRef} className={`album-viewer-stage${zoom > VIEWER_ZOOM_MIN ? " is-zoomed" : ""}${dragging ? " is-dragging" : ""}`}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}
        onWheel={(event) => {
          if (video || !event.deltaY) return;
          // Proporcional al giro: un paso de rueda (~100 px) ≈ 20 %, y el touchpad, que envía pasos pequeños, va suave.
          const pixels = event.deltaY * (event.deltaMode === 1 ? 33 : event.deltaMode === 2 ? 400 : 1);
          zoomTo(zoom * Math.exp(-Math.max(-200, Math.min(200, pixels)) * 0.002), stagePoint(event.clientX, event.clientY));
        }}>
        {layers.map((layer) => <div key={layer.key} className="album-viewer-layer is-leaving" aria-hidden="true">
          {isVideo(layer.file)
            ? layer.file.thumbUrl && <img src={thumbSrc(layer.file, 1920)} alt="" style={fit} />
            : <img src={thumbSrc(layer.file, 1920)} alt="" style={{ ...fit, transform: layer.transform }} />}
        </div>)}
        <div key={layerKey} className={`album-viewer-layer${ready ? " is-ready" : ""}`}>
          {video ? <video src={file.mediaUrl} poster={file.thumbUrl ? thumbSrc(file, 1920) : undefined} controls playsInline
            aria-label={en ? "Shared video" : "Video compartido"} style={{ transform: swipeX ? `translate3d(${swipeX}px, 0, 0)` : undefined }} /> :
            /* Versión de pantalla completa generada por Drive; si falta, se usa el original. */
            <img ref={imageRef} src={thumbSrc(file, 1920)} alt={en ? "Shared photo" : "Fotografía compartida"} draggable={false}
              style={{ ...fit, transform }} onLoad={onPhotoLoad}
              onError={(event) => {
                const fallback = new URL(file.mediaUrl, location.href).href;
                if (event.currentTarget.src !== fallback) event.currentTarget.src = file.mediaUrl;
                else setReadyKey(layerKey);
              }} />}
        </div>
        {canNavigate && <>
          <button type="button" className="album-viewer-nav is-prev" onClick={() => go(-1)} aria-label={en ? "Previous memory" : "Recuerdo anterior"}><ChevronLeft size={26} /></button>
          <button type="button" className="album-viewer-nav is-next" onClick={() => go(1)} aria-label={en ? "Next memory" : "Recuerdo siguiente"}><ChevronRight size={26} /></button>
        </>}
      </div>
    </div>}
  </dialog>;
}
