import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useLanguage } from "../../config/language";
import "../../styles/album-runway.css";

export type RunwayPhoto = { id: string; name: string; type: string; mediaUrl: string };

export function AlbumRunway({ photos, onOpen }: { photos: RunwayPhoto[]; onOpen: (photo: RunwayPhoto) => void }) {
  const { language } = useLanguage();
  const [start, setStart] = useState(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visibleOnScreen, setVisibleOnScreen] = useState(false);
  const section = useRef<HTMLElement>(null);
  const count = photos.length;

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisibleOnScreen(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => { if (event.matches) setPlaying(false); };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!playing || hovered || focused || !visibleOnScreen || count < 2) return;
    const timer = window.setInterval(() => { if (!document.hidden) setStart((value) => (value + 1) % count); }, 4000);
    return () => window.clearInterval(timer);
  }, [playing, hovered, focused, visibleOnScreen, count]);

  if (!count) return null;
  const visible = Array.from({ length: Math.min(count, 5) }, (_, offset) => {
    const index = (start + offset) % count;
    return { photo: photos[index], index };
  });
  const move = (step: number) => setStart((value) => (value + step + count) % count);

  return <section ref={section} className="album-runway" aria-labelledby="album-runway-title"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <p className="eyebrow">{language === "en" ? "Moments in motion" : "Momentos que vuelven"}</p>
    <h2 id="album-runway-title">{language === "en" ? "A walk through our memories" : "Un paseo por nuestros recuerdos"}</h2>
    <div className="album-runway-track">
      {visible.map(({ photo, index }) => <button className="album-runway-photo" type="button" key={photo.id}
        onClick={() => onOpen(photo)} aria-label={language === "en" ? `Open photo ${index + 1}` : `Abrir foto ${index + 1}`}>
        <img src={photo.mediaUrl} alt="" loading="lazy" />
      </button>)}
    </div>
    {count > 1 && <div className="album-runway-controls">
      <button type="button" onClick={() => move(-1)} aria-label={language === "en" ? "Previous photos" : "Fotos anteriores"}><ChevronLeft size={19} aria-hidden="true" /></button>
      <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? (language === "en" ? "Pause slideshow" : "Pausar pasarela") : (language === "en" ? "Play slideshow" : "Reproducir pasarela")}>
        {playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
      </button>
      <button type="button" onClick={() => move(1)} aria-label={language === "en" ? "Next photos" : "Fotos siguientes"}><ChevronRight size={19} aria-hidden="true" /></button>
    </div>}
  </section>;
}
