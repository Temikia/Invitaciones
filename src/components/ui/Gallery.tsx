import { useEffect, useRef, useState } from "react";
import { invitation, galleryChapters as chapters } from "../../config/invitation";
import { galleryCardState } from "../../lib/gallery";
import { useMotion } from "./MotionControl";
import "../../styles/gallery.css";

const roman = ["I", "II", "III", "IV", "V", "VI", "VII"];
const number = (n: number) => String(n + 1).padStart(2, "0");

export function Gallery() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const { mode } = useMotion();
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const region = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const chapter = chapters[active];
  const photo = invitation.photos.gallery[active];
  const move = (step: number) => setActive(index => (index + step + chapters.length) % chapters.length);

  useEffect(() => {
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (region.current) observer.observe(region.current);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (mode === "paused" || paused || interacting || !pageVisible || !visible) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % chapters.length), mode === "gentle" ? 6000 : 3000);
    return () => clearInterval(timer);
  }, [active, mode, paused, interacting, pageVisible, visible]);

  const navigation = () => (
    <div className="memory-controls">
      <button className="memory-arrow" aria-label="Fotografía anterior" onClick={() => move(-1)}>←</button>
      <span className="memory-count"><strong>{number(active)}</strong> <span className="memory-out-of">/ {String(chapters.length).padStart(2, "0")}</span></span>
      <button className="memory-arrow" aria-label="Fotografía siguiente" onClick={() => move(1)}>→</button>
    </div>
  );

  const text = () => (
    <div key={active} className="memory-text change" aria-live={mode === "paused" || paused || interacting ? "polite" : "off"}>
      <span className="memory-label">Capítulo {roman[active]} · {chapter.name}</span>
      <span className="memory-asterisk" aria-hidden="true">✳</span>
      <h3 className="memory-title">{chapter.title}<br /><em>{chapter.accent}</em></h3>
      <p className="memory-description">{chapter.description}</p>
      <span className="memory-quote">{chapter.quote}</span>
    </div>
  );

  return (
    <div className="narrative-gallery" onKeyDown={event => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        if ((event.target as HTMLElement).closest(".memory-card")) {
          region.current?.querySelector<HTMLElement>(".memory-theater")?.focus();
        }
        move(event.key === "ArrowRight" ? 1 : -1);
      }
    }} onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => {
      if (!touch.current) return;
      const dx = event.changedTouches[0].clientX - touch.current.x;
      const dy = event.changedTouches[0].clientY - touch.current.y;
      touch.current = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
    }}>
      <div className="hero">
        <div className="hero-content">
          <p className="eyebrow">Un álbum para recordar</p>
          <h2 className="hero-title"><span className="word">Hay instantes</span><span className="word">que parecen</span><span className="word accent">magia.</span></h2>
          <p className="hero-description">Hay recuerdos que no caben en palabras. Se guardan en una mirada, una sonrisa, un momento… y se vuelven eternos.</p>
        </div>
        <div className="artwork">
          <div className="artwork-halo" /><div className="artwork-ring" aria-hidden="true" /><div className="big-fifteen" aria-hidden="true">15</div>
          <div className="hero-photo hero-photo-main"><img src={invitation.photos.gallery[0]} alt={chapters[0].alt} loading="lazy" /></div>
          <div className="hero-photo hero-photo-secondary"><img src={invitation.photos.gallery[1]} alt={chapters[1].alt} loading="lazy" /></div>
          <div className="seal" aria-hidden="true"><span className="seal-num">XV</span><span className="seal-text">Mis años</span></div>
          <span className="artwork-note">Camila · Mi historia</span>
        </div>
      </div>
      <div className="break-line" />
      <div className="gallery-section" id="galeria" ref={region} role="region" aria-roledescription="carrusel" aria-label="Recuerdos de Camila"
        onFocusCapture={event => setInteracting(!(event.target as HTMLElement).closest(".gallery-playback"))}
        onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false); }}>
        <div className="story-overline">✧ Segundo acto · Un álbum que cobra vida</div>
        <div className="section-heading story-heading">
          <h2 className="section-title">Los recuerdos <em>también bailan.</em></h2>
          <p className="section-note">No son solo fotografías. Son maneras de volver a sentir un instante extraordinario.</p>
        </div>
        <div className="memory-experience">
          <div className="memory-copy">
            {text()}
            {navigation()}
            {mode !== "paused" ? <button type="button" className="gallery-playback" onClick={() => setPaused(value => !value)}>{paused ? "Reanudar galería" : "Pausar galería"}</button> : null}
          </div>
          <div className="memory-theater" tabIndex={0} aria-label="Usa las flechas o desliza para cambiar de recuerdo">
            <div className="memory-ambient" style={{ backgroundImage: `url(${photo})` }} />
            <div className="memory-glow" /><div className="memory-orbit" aria-hidden="true" /><div className="memory-watermark" aria-hidden="true">XV</div>
            <span className="memory-orbit-note" aria-hidden="true">recuerdos en flor</span>
            <div className="memory-deck">
              {chapters.map((item, index) => {
                const state = galleryCardState(index, active, chapters.length);
                const interactive = state === "active" || (mode === "full" && (state === "next" || state === "prev"));
                return (
                  <button
                    key={index}
                    className="memory-card"
                    data-state={state}
                    tabIndex={interactive ? 0 : -1}
                    aria-hidden={!interactive || undefined}
                    aria-label={`${number(index)} · ${item.name}`}
                    onClick={() => setActive(index)}
                  >
                    <span className="memory-card-inner">
                      <img src={invitation.photos.gallery[index]} alt={item.alt} loading="lazy" />
                      <span className="memory-card-cover" />
                      <span className="memory-card-symbol">✧</span>
                      <span className="memory-card-bottom">
                        <small>{item.name}</small>
                        <span>{item.quote}</span>
                      </span>
                    </span>
                    <span className="memory-card-corner top-left" />
                    <span className="memory-card-corner bottom-right" />
                  </button>
                );
              })}
            </div>
            <span className="memory-vertical">Camila · Un recuerdo a la vez</span>
          </div>
        </div>
      </div>
    </div>
  );
}
