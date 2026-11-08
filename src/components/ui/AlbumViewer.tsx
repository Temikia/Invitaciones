import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useLanguage } from "../../config/language";
import { isVideo, thumbSrc, type AlbumFile } from "../../lib/albumShow";
import "../../styles/album-viewer.css";

type AlbumViewerProps = {
  files: AlbumFile[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/** All transforms affect presentation only; the original file is never changed. */
export function AlbumViewer({ files, index, onIndexChange, onClose }: AlbumViewerProps) {
  const { language } = useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const touchStart = useRef<number | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const file = index === null ? null : files[index] ?? null;
  const open = file !== null;
  const canNavigate = files.length > 1;

  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!element.open) element.showModal();
    return () => {
      if (element.open) element.close();
      previousFocus?.focus();
    };
  }, [open]);

  useEffect(() => {
    setZoom(1);
    setRotation(0);
  }, [file?.id]);

  const go = (step: number) => {
    if (index === null || !canNavigate) return;
    onIndexChange((index + step + files.length) % files.length);
  };

  const video = file ? isVideo(file) : false;
  const label = language === "en" ? "Memory viewer" : "Visor de recuerdos";
  return <dialog ref={dialog} className="album-viewer" aria-label={label}
    onCancel={(event) => { event.preventDefault(); closeRef.current(); }}
    onClick={(event) => { if (event.target === event.currentTarget) closeRef.current(); }}
    onKeyDown={(event) => {
      if (event.target instanceof HTMLVideoElement) return;
      if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
    }}>
    {file && index !== null && <div className="album-viewer-panel">
      <div className="album-viewer-toolbar">
        {!video && <div className="album-viewer-tools" role="group" aria-label={language === "en" ? "Photo controls" : "Controles de fotografía"}>
          <button type="button" onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))} disabled={zoom <= 0.5} aria-label={language === "en" ? "Zoom out" : "Alejar"}><ZoomOut size={20} /></button>
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.25))} disabled={zoom >= 3} aria-label={language === "en" ? "Zoom in" : "Acercar"}><ZoomIn size={20} /></button>
          <button type="button" onClick={() => setRotation((value) => (value + 90) % 360)} aria-label={language === "en" ? "Rotate photo clockwise" : "Girar fotografía a la derecha"}><RotateCw size={20} /></button>
        </div>}
        {canNavigate && <span className="album-viewer-count" aria-live="polite">{index + 1} / {files.length}</span>}
        <button type="button" className="album-viewer-close" onClick={onClose} aria-label={language === "en" ? "Close viewer" : "Cerrar visor"} autoFocus><X size={22} /></button>
      </div>
      <div className="album-viewer-stage"
        onTouchStart={(event) => { touchStart.current = zoom === 1 ? event.touches[0].clientX : null; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStart.current;
          touchStart.current = null;
          if (Math.abs(distance) > 60) go(distance < 0 ? 1 : -1);
        }}>
        {video ? <video key={file.id} src={file.mediaUrl} poster={file.thumbUrl ? thumbSrc(file, 1920) : undefined} controls playsInline aria-label={language === "en" ? "Shared video" : "Video compartido"} /> :
          <div key={file.id} className={`album-viewer-photo-wrap${rotation % 180 ? " is-rotated" : ""}`}>
            {/* Versión de pantalla completa generada por Drive; si falta, se usa el original. */}
            <img src={thumbSrc(file, 1920)} alt={language === "en" ? "Shared photo" : "Fotografía compartida"} style={{ zoom, transform: `rotate(${rotation}deg)` }}
              onError={(event) => { if (event.currentTarget.src !== new URL(file.mediaUrl, location.href).href) event.currentTarget.src = file.mediaUrl; }} />
          </div>}
        {canNavigate && <>
          <button type="button" className="album-viewer-nav is-prev" onClick={() => go(-1)} aria-label={language === "en" ? "Previous memory" : "Recuerdo anterior"}><ChevronLeft size={26} /></button>
          <button type="button" className="album-viewer-nav is-next" onClick={() => go(1)} aria-label={language === "en" ? "Next memory" : "Recuerdo siguiente"}><ChevronRight size={26} /></button>
        </>}
      </div>
    </div>}
  </dialog>;
}
