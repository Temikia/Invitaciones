import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Clapperboard, ImagePlus } from "lucide-react";
import { useLanguage } from "../../config/language";
import { invitation } from "../../config/invitation";
import { useReducedMotion, usePageVisible } from "../../hooks/useReducedMotion";
import { HERO_SLIDE_MS, shuffle } from "../../lib/albumShow";
import "../../styles/album-hero.css";

type AlbumHeroProps = { canPlayMovie: boolean; onPlayMovie: () => void };

/**
 * Portada animada con las fotografías de la galería de la invitación en un orden distinto en cada visita.
 * El avance lo marca el final de la barra de progreso, así la pausa conserva el punto exacto.
 * No tiene controles visibles ni se detiene con el cursor o el foco (decisión de la usuaria): solo se
 * pausa con la pestaña oculta o fuera de pantalla, y con movimiento reducido muestra una foto fija.
 */
export function AlbumHero({ canPlayMovie, onPlayMovie }: AlbumHeroProps) {
  const { language } = useLanguage();
  const photos = useMemo(() => shuffle(invitation.photos.gallery), []);
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(true);
  const section = useRef<HTMLElement>(null);
  const leaving = photos.length > 1 ? (active - 1 + photos.length) % photos.length : -1;
  const paused = reducedMotion || !pageVisible || !onScreen;

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <section ref={section} className={`album-hero${paused ? " is-paused" : ""}`} aria-labelledby="album-title"
    style={{ "--hero-slide": `${HERO_SLIDE_MS}ms` } as CSSProperties}>
    <div className="album-hero-media" aria-hidden="true">
      {photos.map((src, index) => <img key={src} src={src} alt="" decoding="async"
        loading={index < 2 ? "eager" : "lazy"} className={index === active ? "is-active" : index === leaving ? "is-leaving" : undefined} />)}
    </div>
    {!reducedMotion && photos.length > 1 && <div className="album-hero-bars" aria-hidden="true">
      {photos.map((src, index) => <i key={src} className={index < active ? "is-done" : index === active ? "is-now" : undefined}>
        {index === active && <b key={active} onAnimationEnd={() => setActive((value) => (value + 1) % photos.length)} />}
      </i>)}
    </div>}
    <div className="album-hero-copy">
      <p className="eyebrow">{language === "en" ? "Camila's XV · The album" : "Mis XV · Camila · Álbum"}</p>
      <h1 id="album-title">{language === "en" ? <>Our night,<br /><em>our memories</em></> : <>Nuestra noche,<br /><em>nuestros recuerdos</em></>}</h1>
      <p>{language === "en" ? "A collection of moments shared by the people who celebrated with Camila." : "Momentos compartidos por quienes celebraron con Camila."}</p>
      <div className="album-hero-actions">
        {canPlayMovie && <button type="button" className="album-hero-movie" onClick={onPlayMovie}>
          <Clapperboard size={17} aria-hidden="true" /> {language === "en" ? "Watch as a movie" : "Ver como película"}
        </button>}
        <a href="/recuerdos" className="album-hero-upload">
          <ImagePlus size={17} aria-hidden="true" /> {language === "en" ? "Upload my photos" : "Subir mis fotos"}
        </a>
      </div>
    </div>
  </section>;
}
