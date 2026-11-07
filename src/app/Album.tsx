import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Film, LockKeyhole } from "lucide-react";
import { useLanguage } from "../config/language";
import { AlbumViewer } from "../components/ui/AlbumViewer";
import { AlbumRunway } from "../components/ui/AlbumRunway";
import { ALBUM_PAGE_SIZE, paginateAlbum } from "../lib/albumPagination";

type GalleryFile = { id: string; name: string; type: string; mediaUrl: string };

export default function Album() {
  const { language } = useLanguage();
  const secretRef = useRef(window.location.hash.slice(1));
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<GalleryFile | null>(null);

  useEffect(() => {
    let active = true;
    if (window.location.hash) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    setLoading(true);
    setError("");
    const load = async () => {
      try {
        if (secretRef.current) {
          const access = await fetch("/api/drive/gallery/access", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret: secretRef.current }),
          });
          if (!access.ok) throw new Error(language === "en" ? "This private link is invalid or expired." : "Este enlace privado no es válido o ya venció.");
        }
        const response = await fetch("/api/drive/gallery/index");
        const result = await response.json().catch(() => ({}));
        if (response.status === 401) throw new Error(language === "en" ? "Open the album using your private link." : "Abre el álbum desde tu enlace privado.");
        if (!response.ok) throw new Error(result.error || (language === "en" ? "The album could not be opened." : "No se pudo abrir el álbum."));
        if (active) setFiles(Array.isArray(result.files) ? result.files : []);
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : (language === "en" ? "The album could not be opened." : "No se pudo abrir el álbum."));
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [language]);

  const { page: currentPage, pageCount, files: pageFiles } = paginateAlbum(files, page);
  const photos = files.filter((file) => file.type.startsWith("image/"));

  return <main className="memories-page">
    <a href="/recuerdos" className="back-link"><ArrowLeft size={17} /> {language === "en" ? "Back to memories" : "Volver a recuerdos"}</a>
    <div className="gallery-content">
      <LockKeyhole size={32} strokeWidth={1} className="gold-icon" />
      <p className="eyebrow">{language === "en" ? "A private album" : "Un álbum privado"}</p>
      <h1>{language === "en" ? <>Our night.<br /><em>Our memories.</em></> : <>Nuestra noche.<br /><em>Nuestros recuerdos.</em></>}</h1>
      <p>{language === "en" ? "A collection of moments shared by the people who celebrated with Camila." : "Momentos compartidos por quienes celebraron con Camila."}</p>
      {loading ? <div className="upload-notice" role="status">{language === "en" ? "Opening the private album…" : "Abriendo el álbum privado…"}</div> : null}
      {error ? <div className="upload-notice" role="alert">{error}</div> : null}
      {!loading && !error && files.length === 0 ? <div className="upload-notice" role="status">{language === "en" ? "No memories have been shared yet." : "Todavía no se han compartido recuerdos."}</div> : null}
      {!loading && !error && files.length > 0 && <>
        <AlbumRunway photos={photos} onOpen={setSelected} />
        <section aria-labelledby="album-complete-title" className="album-complete">
          <h2 id="album-complete-title">{language === "en" ? "The complete album" : "Álbum completo"}</h2>
          <div className="memory-grid">{pageFiles.map((file, index) => <button type="button" className="memory-item" key={file.id} onClick={() => setSelected(file)} aria-label={`${file.type.startsWith("video/") ? (language === "en" ? "Open video" : "Abrir video") : (language === "en" ? "Open photo" : "Abrir foto")} ${((currentPage - 1) * ALBUM_PAGE_SIZE) + index + 1}`}>
            {file.type.startsWith("video/") ? <span className="memory-video"><Film size={28} aria-hidden="true" /></span> : <img src={file.mediaUrl} loading="lazy" alt="" />}
          </button>)}</div>
          {pageCount > 1 && <nav className="album-pagination" aria-label={language === "en" ? "Album pages" : "Páginas del álbum"}>
            <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>{language === "en" ? "Previous" : "Anterior"}</button>
            <span aria-live="polite">{language === "en" ? `Page ${currentPage} of ${pageCount}` : `Página ${currentPage} de ${pageCount}`}</span>
            <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>{language === "en" ? "Next" : "Siguiente"}</button>
          </nav>}
        </section>
      </>}
    </div>
    <AlbumViewer file={selected} onClose={() => setSelected(null)} />
  </main>;
}
