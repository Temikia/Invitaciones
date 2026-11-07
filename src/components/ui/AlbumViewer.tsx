import { useEffect, useRef, useState } from "react";
import { RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useLanguage } from "../../config/language";
import "../../styles/album-viewer.css";

type ViewerFile = { id: string; type: string; mediaUrl: string };

type AlbumViewerProps = { file: ViewerFile | null; onClose: () => void };

/** All transforms affect presentation only; the original file is never changed. */
export function AlbumViewer({ file, onClose }: AlbumViewerProps) {
  const { language } = useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const element = dialog.current;
    if (!element || !file) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setZoom(1);
    setRotation(0);
    if (!element.open) element.showModal();
    return () => {
      if (element.open) element.close();
      previousFocus?.focus();
    };
  }, [file]);

  const isVideo = file?.type.startsWith("video/") ?? false;
  const label = language === "en" ? "Memory viewer" : "Visor de recuerdos";
  return <dialog ref={dialog} className="album-viewer" aria-label={label}
    onCancel={(event) => { event.preventDefault(); closeRef.current(); }}
    onClick={(event) => { if (event.target === event.currentTarget) closeRef.current(); }}>
    {file && <div className="album-viewer-panel">
      <div className="album-viewer-toolbar">
        {!isVideo && <div className="album-viewer-tools" role="group" aria-label={language === "en" ? "Photo controls" : "Controles de fotografía"}>
          <button type="button" onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))} disabled={zoom <= 0.5} aria-label={language === "en" ? "Zoom out" : "Alejar"}><ZoomOut size={20} /></button>
          <span aria-live="polite">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => setZoom((value) => Math.min(3, value + 0.25))} disabled={zoom >= 3} aria-label={language === "en" ? "Zoom in" : "Acercar"}><ZoomIn size={20} /></button>
          <button type="button" onClick={() => setRotation((value) => (value + 90) % 360)} aria-label={language === "en" ? "Rotate photo clockwise" : "Girar fotografía a la derecha"}><RotateCw size={20} /></button>
        </div>}
        <button type="button" className="album-viewer-close" onClick={onClose} aria-label={language === "en" ? "Close viewer" : "Cerrar visor"} autoFocus><X size={22} /></button>
      </div>
      <div className="album-viewer-stage">
        {isVideo ? <video src={file.mediaUrl} controls playsInline aria-label={language === "en" ? "Shared video" : "Video compartido"} /> :
          <div className={`album-viewer-photo-wrap${rotation % 180 ? " is-rotated" : ""}`}>
            <img src={file.mediaUrl} alt={language === "en" ? "Shared photo" : "Fotografía compartida"} style={{ zoom, transform: `rotate(${rotation}deg)` }} />
          </div>}
      </div>
    </div>}
  </dialog>;
}
