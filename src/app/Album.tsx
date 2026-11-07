import { useEffect, useRef, useState } from "react";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useLanguage } from "../config/language";

type GalleryFile = { id: string; name: string; type: string; mediaUrl: string };

export default function Album() {
  const { language, setLanguage, t } = useLanguage();
  const secretRef = useRef(window.location.hash.slice(1));
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [error, setError] = useState("");

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

  return <main className="memories-page">
    <div className="language-switch memories-language-switch" role="group" aria-label={t("header.switch")}>
      <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>En</button><span aria-hidden="true">|</span>
      <button type="button" aria-pressed={language === "es"} onClick={() => setLanguage("es")}>Es</button>
    </div>
    <a href="/recuerdos" className="back-link"><ArrowLeft size={17} /> {language === "en" ? "Back to memories" : "Volver a recuerdos"}</a>
    <div className="gallery-content">
      <LockKeyhole size={32} strokeWidth={1} className="gold-icon" />
      <p className="eyebrow">{language === "en" ? "A private album" : "Un álbum privado"}</p>
      <h1>{language === "en" ? <>Our night.<br /><em>Our memories.</em></> : <>Nuestra noche.<br /><em>Nuestros recuerdos.</em></>}</h1>
      <p>{language === "en" ? "A collection of moments shared by the people who celebrated with Camila." : "Momentos compartidos por quienes celebraron con Camila."}</p>
      {loading ? <div className="upload-notice" role="status">{language === "en" ? "Opening the private album…" : "Abriendo el álbum privado…"}</div> : null}
      {error ? <div className="upload-notice" role="alert">{error}</div> : null}
      {!loading && !error && files.length === 0 ? <div className="upload-notice" role="status">{language === "en" ? "No memories have been shared yet." : "Todavía no se han compartido recuerdos."}</div> : null}
      <div className="memory-grid">{files.map((file) => <figure className="memory-item" key={file.id}>
        {file.type.startsWith("video/") ? <video src={file.mediaUrl} controls preload="none" playsInline aria-label={file.name} /> : <a href={file.mediaUrl} target="_blank" rel="noreferrer"><img src={file.mediaUrl} loading="lazy" alt={file.name} /></a>}
        <figcaption>{file.name}</figcaption>
      </figure>)}</div>
    </div>
  </main>;
}
