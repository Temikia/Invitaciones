import { useEffect, useRef, useState } from "react";
import { invitation, galleryChapters as chapters } from "../../config/invitation";
import { useLanguage } from "../../config/language";
import { galleryCardState } from "../../lib/gallery";
import "../../styles/gallery.css";

const roman = ["I", "II", "III", "IV", "V", "VI", "VII"];
const number = (n: number) => String(n + 1).padStart(2, "0");

export function Gallery() {
  const { t, chapter: translatedChapter } = useLanguage();
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const region = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const chapter = translatedChapter(active);
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
    if (interacting || !pageVisible || !visible) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % chapters.length), 3000);
    return () => clearInterval(timer);
  }, [active, interacting, pageVisible, visible]);

  const navigation = () => (
    <div className="memory-controls">
      <button className="memory-arrow" aria-label={t("gallery.prev")} onClick={() => move(-1)}>←</button>
      <span className="memory-count"><strong>{number(active)}</strong> <span className="memory-out-of">/ {String(chapters.length).padStart(2, "0")}</span></span>
      <button className="memory-arrow" aria-label={t("gallery.next")} onClick={() => move(1)}>→</button>
    </div>
  );

  const text = () => (
    <div key={active} className="memory-text change" aria-live={interacting ? "polite" : "off"}>
      <span className="memory-label">{t("gallery.chapter")} {roman[active]} · {chapter[0]}</span>
      <span className="memory-asterisk" aria-hidden="true">✳</span>
      <h3 className="memory-title">{chapter[1]}<br /><em>{chapter[2]}</em></h3>
      <p className="memory-description">{chapter[3]}</p>
      <span className="memory-quote">{chapter[4]}</span>
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
          <p className="eyebrow">{t("gallery.hero.eyebrow")}</p>
          <h2 className="hero-title"><span className="word">{t("gallery.hero.line1")}</span><span className="word">{t("gallery.hero.line2")}</span><span className="word accent">{t("gallery.hero.line3")}</span></h2>
          <p className="hero-description">{t("gallery.hero.copy")}</p>
        </div>
        <div className="artwork">
          <div className="artwork-halo" /><div className="artwork-ring" aria-hidden="true" /><div className="big-fifteen" aria-hidden="true">15</div>
          <div className="hero-photo hero-photo-main"><img src={invitation.photos.galleryHeroMain} alt={t("gallery.alt.main")} loading="lazy" /></div>
          <div className="hero-photo hero-photo-secondary"><img src={invitation.photos.galleryHeroSecondary} alt={t("gallery.alt.secondary")} loading="lazy" /></div>
          <div className="seal" aria-hidden="true"><span className="seal-num">XV</span><span className="seal-text">{t("gallery.seal")}</span></div>
          <span className="artwork-note">{t("gallery.note")}</span>
        </div>
      </div>
      <div className="break-line" />
      <div className="gallery-section" id="galeria" ref={region} role="region" aria-roledescription="carousel" aria-label={t("gallery.aria")}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false); }}>
        <div className="story-overline">{t("gallery.overline")}</div>
        <div className="section-heading story-heading">
          <h2 className="section-title">{t("gallery.title")} <em>{t("gallery.title2")}</em></h2>
          <p className="section-note">{t("gallery.copy")}</p>
        </div>
        <div className="memory-experience">
          <div className="memory-copy">
            {text()}
            {navigation()}
          </div>
          <div className="memory-theater" tabIndex={0} aria-label={t("gallery.theater")}>
            <div className="memory-ambient" style={{ backgroundImage: `url(${photo})` }} />
            <div className="memory-glow" /><div className="memory-orbit" aria-hidden="true" /><div className="memory-watermark" aria-hidden="true">XV</div>
            <span className="memory-orbit-note" aria-hidden="true">{t("gallery.orbit")}</span>
            <div className="memory-deck">
              {chapters.map((_, index) => {
                const state = galleryCardState(index, active, chapters.length);
                const interactive = state === "active" || state === "next" || state === "prev";
                return (
                  <button
                    key={index}
                    className="memory-card"
                    data-state={state}
                    tabIndex={interactive ? 0 : -1}
                    aria-hidden={!interactive || undefined}
                    aria-label={`${number(index)} · ${translatedChapter(index)[0]}`}
                    onClick={() => setActive(index)}
                  >
                    <span className="memory-card-inner">
                      <img src={invitation.photos.gallery[index]} alt={t("gallery.alt.photo")} loading="lazy" />
                      <span className="memory-card-cover" />
                      <span className="memory-card-symbol">✧</span>
                      <span className="memory-card-bottom">
                        <small>{translatedChapter(index)[0]}</small>
                        <span>{translatedChapter(index)[4]}</span>
                      </span>
                    </span>
                    <span className="memory-card-corner top-left" />
                    <span className="memory-card-corner bottom-right" />
                  </button>
                );
              })}
            </div>
            <span className="memory-vertical">{t("gallery.note")} · {t("gallery.orbit")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
