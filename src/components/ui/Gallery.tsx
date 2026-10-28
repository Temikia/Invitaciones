import { useEffect, useRef, useState } from "react";
import { invitation, galleryChapters as chapters } from "../../config/invitation";
import "../../styles/gallery.css";

const roman = ["I", "II", "III", "IV", "V"];
const number = (n: number) => String(n + 1).padStart(2, "0");

export function Gallery() {
  const [active, setActive] = useState(0);
  const [cinema, setCinema] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const region = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const chapter = chapters[active];
  const photo = invitation.photos.gallery[active];
  const move = (step: number) => setActive(index => (index + step + chapters.length) % chapters.length);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    const visibility = () => setPageVisible(!document.hidden);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (region.current) observer.observe(region.current);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reduced || interacting || !pageVisible || (!visible && !cinema)) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % chapters.length), 3000);
    return () => clearInterval(timer);
  }, [active, reduced, interacting, pageVisible, visible, cinema]);

  useEffect(() => {
    if (!cinema) return;
    const el = dialog.current;
    const overflow = document.body.style.overflow;
    el?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = overflow;
    };
  }, [cinema]);

  const navigation = (modal = false) => <div className={modal ? "cinema-nav" : "memory-controls"}>
    <button className={modal ? "cinema-arrow" : "memory-arrow"} aria-label="Fotografía anterior" onClick={() => move(-1)}>←</button>
    <span className="memory-count"><strong>{number(active)}</strong> <span className="memory-out-of">/ 05</span></span>
    <button className={modal ? "cinema-arrow" : "memory-arrow"} aria-label="Fotografía siguiente" onClick={() => move(1)}>→</button>
  </div>;
  const text = (modal = false) => <div key={modal ? "cinema-side" : active} className={modal ? "cinema-side" : "memory-text change"} aria-live={reduced ? "polite" : "off"}>
    <span className={modal ? "cinema-chapter" : "memory-label"}>Capítulo {roman[active]} · {chapter.name}</span>
    <span className="memory-asterisk" aria-hidden="true">✳</span>
    <h3 className={modal ? "cinema-title" : "memory-title"}>{chapter.title}<br /><em>{chapter.accent}</em></h3>
    <p className={modal ? "cinema-description" : "memory-description"}>{chapter.description}</p>
    <span className="memory-quote">{chapter.quote}</span>
    {modal && navigation(true)}
  </div>;

  return <div className="narrative-gallery" onKeyDown={event => {
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
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => setCinema(true)}>Vivir la experiencia <span className="arrow">↗</span></button>
          <a className="quiet-link" href="#galeria">Explorar fotografías</a>
        </div>
      </div>
      <div className="artwork">
        <div className="artwork-halo" /><div className="artwork-ring" aria-hidden="true" /><div className="big-fifteen" aria-hidden="true">15</div>
        <div className="hero-photo hero-photo-main"><img src={invitation.photos.gallery[0]} alt={chapters[0].alt} loading="lazy" /></div>
        <div className="hero-photo hero-photo-secondary"><img src={invitation.photos.gallery[1]} alt={chapters[1].alt} loading="lazy" /></div>
        <div className="seal" aria-hidden="true"><span className="seal-num">XV</span><span className="seal-text">Mis años</span></div>
        <span className="artwork-note">Camila · Una historia en imágenes</span>
      </div>
    </div>
    <div className="break-line" />
    <div className="gallery-section" id="galeria" ref={region} role="region" aria-roledescription="carrusel" aria-label="Cinco recuerdos de Camila"
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false); }}>
      <div className="story-overline">✧ Segundo acto · Un álbum que cobra vida</div>
      <div className="section-heading story-heading">
        <h2 className="section-title">Los recuerdos <em>también bailan.</em></h2>
        <p className="section-note">No son solo fotografías. Son cinco maneras de volver a sentir un instante extraordinario.</p>
      </div>
      <div className="memory-experience">
        <div className="memory-copy">
          {text()}
          <button className="memory-enter" onClick={() => setCinema(true)}>Vivir este instante <span className="enter-arrow">↗</span></button>
          {navigation()}
        </div>
        <div className="memory-theater" tabIndex={0} aria-label="Usa las flechas o desliza para cambiar de recuerdo">
          <div className="memory-ambient" style={{ backgroundImage: `url(${photo})` }} />
          <div className="memory-glow" /><div className="memory-orbit" aria-hidden="true" /><div className="memory-watermark" aria-hidden="true">XV</div>
          <span className="memory-orbit-note" aria-hidden="true">recuerdos en flor</span>
          <div className="memory-deck">
            {chapters.map((item, index) => {
              const offset = (index - active + chapters.length) % chapters.length;
              const state = ["active", "next", "far-next", "far-prev", "prev"][offset];
              return <button key={index} className="memory-card" data-state={state} tabIndex={offset === 2 || offset === 3 ? -1 : 0} aria-hidden={offset === 2 || offset === 3 ? true : undefined} aria-label={`${number(index)} · ${item.name}${index === active ? ", abrir en modo cine" : ""}`} onClick={() => index === active ? setCinema(true) : setActive(index)}>
                <span className="memory-card-inner"><img src={invitation.photos.gallery[index]} alt={item.alt} loading="lazy" /><span className="memory-card-cover" /><span className="memory-card-top">{number(index)} / 05</span><span className="memory-card-symbol">✧</span><span className="memory-card-bottom"><small>{item.name}</small><span>{item.quote}</span></span></span>
                <span className="memory-card-corner top-left" /><span className="memory-card-corner bottom-right" />
              </button>;
            })}
          </div>
          <span className="memory-vertical">Camila · Un recuerdo a la vez</span>
        </div>
      </div>
      <p className="memory-helper">Desliza para cambiar de recuerdo · Toca la foto central para entrar en ella</p>
    </div>
    <div className="outro">
      <p className="outro-eyebrow">Un capítulo inolvidable</p>
      <h2 className="outro-title">El tiempo pasa.<br /><em>La magia se queda.</em></h2>
      <p className="outro-note">Cinco encuadres, una misma historia. Descúbrelos como si estuvieras ahí.</p>
      <button className="primary-btn" onClick={() => setCinema(true)}>Entrar al modo cine <span className="arrow">↗</span></button>
    </div>
    <dialog ref={dialog} className="cinema" aria-label="Una historia en imágenes" onCancel={() => setCinema(false)} onClose={() => setCinema(false)}>
      {cinema && <>
        <div className="cinema-ambient" style={{ backgroundImage: `url(${photo})` }} />
        <div className="cinema-top"><span className="cinema-mark"><b>Camila</b> Una historia en imágenes</span><button autoFocus className="cinema-top-btn" aria-label="Cerrar galería" onClick={() => setCinema(false)}><span className="cinema-close-icon" aria-hidden="true">×</span> Cerrar</button></div>
        <div className="cinema-stage"><div className="cinema-photo-frame"><div className="cinema-photo transition-in" key={active}><img src={photo} alt={chapter.alt} /></div></div>{text(true)}</div>
        <div className="cinema-bottom">{chapters.map((item, index) => <button className={`film-thumb ${index === active ? "active" : ""}`} key={index} aria-label={`Ver ${item.name}`} aria-pressed={index === active} onClick={() => setActive(index)}><img src={invitation.photos.gallery[index]} alt="" /></button>)}</div>
      </>}
    </dialog>
  </div>;
}
