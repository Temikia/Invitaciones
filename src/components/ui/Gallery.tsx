import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { invitation } from "../../config/invitation";

export function Gallery() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function move(index: number) {
    track.current?.children[index]?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  return (
    <div className="gallery">
      <div
        className="gallery-track"
        ref={track}
        tabIndex={0}
        aria-label="Galería de Camila, desliza para ver más fotos"
        onScroll={() => {
          const el = track.current;
          if (el) {
            if (el.scrollLeft <= 2) {
              setActive(0);
              return;
            }
            if (el.scrollWidth - el.clientWidth - el.scrollLeft <= 2) {
              setActive(invitation.photos.gallery.length - 1);
              return;
            }
            const middle = el.scrollLeft + el.clientWidth / 2;
            const distances = Array.from(el.children).map((child) =>
              Math.abs(
                (child as HTMLElement).offsetLeft +
                  child.clientWidth / 2 -
                  middle,
              ),
            );
            setActive(distances.indexOf(Math.min(...distances)));
          }
        }}
      >
        {invitation.photos.gallery.map((src, i) => (
          <figure className={`gallery-photo photo-${i}`} key={src}>
            <img
              src={src}
              alt={`Camila, retrato ${i + 1} de ${invitation.photos.gallery.length}`}
              loading="lazy"
              width="1000"
              height="1400"
            />
            <figcaption>
              Un instante de mi historia <span>0{i + 1}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="gallery-controls">
        <button
          className="icon-button"
          aria-label="Fotografía anterior"
          disabled={active === 0}
          onClick={() => move(active - 1)}
        >
          <ArrowLeft size={18} />
        </button>
        <span className="gallery-index" aria-live="polite">
          0{active + 1} <i /> 0{invitation.photos.gallery.length}
        </span>
        <button
          className="icon-button"
          aria-label="Fotografía siguiente"
          disabled={active === invitation.photos.gallery.length - 1}
          onClick={() => move(active + 1)}
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
