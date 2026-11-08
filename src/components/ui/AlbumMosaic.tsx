import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ImageOff, Play } from "lucide-react";
import { useLanguage } from "../../config/language";
import { ALBUM_PAGE_SIZE, nextVisibleCount, revealAlbum } from "../../lib/albumPagination";
import { filterAlbum, isVideo, mosaicTile, thumbSrc, type AlbumFile, type AlbumFilter, type ThumbSize } from "../../lib/albumShow";
import "../../styles/album-mosaic.css";

type AlbumMosaicProps = { files: AlbumFile[]; onOpen: (list: AlbumFile[], index: number) => void };

const FILTERS: { id: AlbumFilter; es: string; en: string }[] = [
  { id: "all", es: "Todo", en: "All" },
  { id: "photos", es: "Fotos", en: "Photos" },
  { id: "videos", es: "Videos", en: "Videos" },
];

/**
 * Miniatura para el cuadro. Si no se puede obtener, se muestra un cuadro con ícono en lugar de
 * descargar el original (puede pesar decenas de MB); el visor sí intenta abrir el original.
 */
function MosaicThumb({ file, size, video }: { file: AlbumFile; size: ThumbSize; video: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = thumbSrc(file, size);
  const fallback = () => setFailed(true);
  if (failed) return <span className="album-tile-video">
    {video ? <><Play size={26} fill="currentColor" aria-hidden="true" /><span>Video</span></> : <ImageOff size={24} aria-hidden="true" />}
  </span>;
  return <>
    <img src={src} alt="" loading="lazy" decoding="async" onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={fallback} />
    {video && <span className="album-tile-play" aria-hidden="true"><Play size={18} fill="currentColor" /></span>}
  </>;
}

/**
 * Mosaico de tamaños variados con destello dorado; el destello solo se anima en los cuadros visibles.
 * Muestra ALBUM_PAGE_SIZE recuerdos y cada «Ver más» agrega otra tanda: solo se piden esas miniaturas.
 */
export function AlbumMosaic({ files, onOpen }: AlbumMosaicProps) {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<AlbumFilter>("all");
  const [visible, setVisible] = useState(ALBUM_PAGE_SIZE);
  const observer = useRef<IntersectionObserver | null>(null);
  const filtered = filterAlbum(files, filter);
  const { files: shown, remaining } = revealAlbum(filtered, visible);
  const photoCount = files.filter((file) => !isVideo(file)).length;
  const videoCount = files.length - photoCount;

  // Se crea al registrar el primer cuadro: las referencias se asignan antes que los efectos.
  const watch = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    observer.current ??= new IntersectionObserver((entries) => {
      for (const entry of entries) (entry.target as HTMLElement).toggleAttribute("data-onscreen", entry.isIntersecting);
    }, { rootMargin: "80px 0px" });
    const current = observer.current;
    current.observe(element);
    return () => current.unobserve(element);
  }, []);

  useEffect(() => () => {
    observer.current?.disconnect();
    observer.current = null;
  }, []);

  // Al cargar otra tanda, el foco pasa al primer recuerdo nuevo para seguir con el teclado.
  const focusFrom = useRef<number | null>(null);
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (focusFrom.current === null) return;
    const target = list.current?.querySelectorAll<HTMLButtonElement>(".album-tile button")[focusFrom.current];
    focusFrom.current = null;
    target?.focus({ preventScroll: true });
  }, [visible]);
  const showMore = () => {
    focusFrom.current = shown.length;
    setVisible((value) => nextVisibleCount(value, filtered.length));
  };

  const choose = (next: AlbumFilter) => {
    setFilter(next);
    setVisible(ALBUM_PAGE_SIZE);
  };

  const countLabel = language === "en"
    ? `${photoCount} ${photoCount === 1 ? "photo" : "photos"} · ${videoCount} ${videoCount === 1 ? "video" : "videos"}`
    : `${photoCount} ${photoCount === 1 ? "foto" : "fotos"} · ${videoCount} ${videoCount === 1 ? "video" : "videos"}`;

  return <section className="album-mosaic-section" aria-labelledby="album-complete-title">
    <h2 id="album-complete-title" className="sr-only">{language === "en" ? "The complete album" : "Álbum completo"}</h2>
    <div className="album-filters">
      <div className="album-filter-group" role="group" aria-label={language === "en" ? "Show" : "Mostrar"}>
        {FILTERS.map((option) => <button key={option.id} type="button" aria-pressed={filter === option.id} onClick={() => choose(option.id)}>
          {language === "en" ? option.en : option.es}
        </button>)}
      </div>
      <span className="album-count">{countLabel}</span>
    </div>
    {shown.length === 0 ? <p className="album-empty-filter" role="status">
      {filter === "videos" ? (language === "en" ? "No videos have been shared yet." : "Todavía no hay videos.") : (language === "en" ? "No photos have been shared yet." : "Todavía no hay fotos.")}
    </p> : <ul ref={list} className="album-mosaic">
      {shown.map((file, index) => {
        const video = isVideo(file);
        const tile = mosaicTile(index);
        const style = { "--glint-delay": `${-((index * 1.9) % 7).toFixed(1)}s`, "--glint-speed": `${6 + (index % 4)}s` } as CSSProperties;
        return <li key={file.id} className={`album-tile${tile ? ` album-tile--${tile}` : ""}`} style={style} ref={watch}>
          <button type="button" onClick={() => onOpen(shown, index)}
            aria-label={`${video ? (language === "en" ? "Open video" : "Abrir video") : (language === "en" ? "Open photo" : "Abrir foto")} ${index + 1}`}>
            <MosaicThumb key={tile ? 960 : 480} file={file} size={tile ? 960 : 480} video={video} />
          </button>
        </li>;
      })}
    </ul>}
    {remaining > 0 && <div className="album-more">
      <button type="button" onClick={showMore}
        aria-label={language === "en" ? `See more (${remaining} remaining)` : `Ver más (quedan ${remaining})`}>
        {language === "en" ? "See more" : "Ver más"}
      </button>
    </div>}
  </section>;
}
