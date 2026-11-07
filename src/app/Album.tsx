import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../config/language";
import { AlbumHero } from "../components/ui/AlbumHero";
import { AlbumMosaic } from "../components/ui/AlbumMosaic";
import { AlbumMovie } from "../components/ui/AlbumMovie";
import { AlbumViewer } from "../components/ui/AlbumViewer";
import type { AlbumFile } from "../lib/albumShow";

type ViewerState = { list: AlbumFile[]; index: number } | null;

export default function Album() {
  const { language } = useLanguage();
  const secretRef = useRef(window.location.hash.slice(1));
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<AlbumFile[]>([]);
  const [error, setError] = useState("");
  const [viewer, setViewer] = useState<ViewerState>(null);
  const [movieOpen, setMovieOpen] = useState(false);

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

  const ready = !loading && !error;
  return <main className="album-page">
    <AlbumHero canPlayMovie={ready && files.length > 0} onPlayMovie={() => setMovieOpen(true)} />
    <div className="album-body">
      {loading ? <div className="upload-notice" role="status">{language === "en" ? "Opening the private album…" : "Abriendo el álbum privado…"}</div> : null}
      {error ? <div className="upload-notice" role="alert">{error}</div> : null}
      {ready && files.length === 0 ? <div className="upload-notice" role="status">{language === "en" ? "No memories have been shared yet." : "Todavía no se han compartido recuerdos."}</div> : null}
      {ready && files.length > 0 && <AlbumMosaic files={files} onOpen={(list, index) => setViewer({ list, index })} />}
    </div>
    <AlbumViewer files={viewer?.list ?? []} index={viewer?.index ?? null}
      onIndexChange={(index) => setViewer((value) => value && { ...value, index })} onClose={() => setViewer(null)} />
    <AlbumMovie files={files} open={movieOpen} onClose={() => setMovieOpen(false)} />
  </main>;
}
