import { useEffect, useState } from "react";
import { useLanguage } from "../config/language";
import { AlbumHero } from "../components/ui/AlbumHero";
import { AlbumMosaic } from "../components/ui/AlbumMosaic";
import { AlbumMovie } from "../components/ui/AlbumMovie";
import { AlbumViewer } from "../components/ui/AlbumViewer";
import type { AlbumFile } from "../lib/albumShow";

type ViewerState = { list: AlbumFile[]; index: number } | null;

export default function Album() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<AlbumFile[]>([]);
  const [error, setError] = useState("");
  const [viewer, setViewer] = useState<ViewerState>(null);
  const [movieOpen, setMovieOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const load = async () => {
      try {
        const response = await fetch("/api/drive/gallery/index");
        const result = await response.json().catch(() => ({}));
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
      {loading ? <div className="upload-notice" role="status">{language === "en" ? "Opening the album…" : "Abriendo el álbum…"}</div> : null}
      {error ? <div className="upload-notice" role="alert">{error}</div> : null}
      {ready && files.length === 0 ? <div className="upload-notice" role="status">{language === "en" ? "No memories have been shared yet." : "Todavía no se han compartido recuerdos."}</div> : null}
      {ready && files.length > 0 && <AlbumMosaic files={files} onOpen={(list, index) => setViewer({ list, index })} />}
    </div>
    <AlbumViewer files={viewer?.list ?? []} index={viewer?.index ?? null}
      onIndexChange={(index) => setViewer((value) => value && { ...value, index })} onClose={() => setViewer(null)} />
    <AlbumMovie files={files} open={movieOpen} onClose={() => setMovieOpen(false)} />
  </main>;
}
