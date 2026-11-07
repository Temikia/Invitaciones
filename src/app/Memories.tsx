import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ArrowLeft, Camera, Film, ImagePlus, LockKeyhole } from "lucide-react";
import { invitation } from "../config/invitation";
import { validateFiles } from "../lib/event";
import { useLanguage } from "../config/language";
import { uploadResumable } from "../lib/resumable";

type TurnstileApi = {
  render: (container: HTMLElement, options: { sitekey: string; action: string; theme: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global { interface Window { turnstile?: TurnstileApi } }

type GalleryFile = { id: string; name: string; type: string; size: number; createdTime: string | null; mediaUrl: string };

const mimeByExtension: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
  heic: "image/heic", heif: "image/heif", mp4: "video/mp4",
  mov: "video/quicktime", webm: "video/webm", m4v: "video/mp4",
};

function SelectedPreview({ file, language, progress }: { file: File; language: string; progress: number }) {
  const [url, setUrl] = useState("");
  const [failed, setFailed] = useState(false);
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const video = file.type.startsWith("video/") || ["mp4", "mov", "webm", "m4v"].includes(extension);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    setFailed(false);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return <div className="selected-preview" aria-hidden="true">
    {url && !failed ? video
      ? <video src={`${url}#t=0.1`} preload="metadata" muted playsInline onError={() => setFailed(true)} />
      : <img src={url} alt="" onError={() => setFailed(true)} />
      : <div className="selected-preview-fallback"><ImagePlus size={24} /><span>{language === "en" ? "Preview unavailable" : "Vista previa no disponible"}</span></div>}
    <span className="selected-preview-veil" style={{ transform: `scaleY(${1 - Math.max(0, Math.min(100, progress)) / 100})` }} />
    {video && !failed ? <span className="selected-preview-video"><Film size={14} /> <span>Video</span></span> : null}
  </div>;
}

export default function Memories() {
  const { language, setLanguage, t } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [ready, setReady] = useState(false);
  const [siteKey, setSiteKey] = useState("");
  const [localTestMode, setLocalTestMode] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [galleryMode, setGalleryMode] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<GalleryFile[]>([]);
  const [galleryError, setGalleryError] = useState("");
  const challengeRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const sessionsRef = useRef<{ sessionUrl: string }[] | null>(null);
  const attemptedRef = useRef<boolean[]>([]);
  const completedRef = useRef<boolean[]>([]);
  const albumRequested = new URLSearchParams(window.location.search).get("album") === "1";
  const closed = Date.now() >= new Date(invitation.uploads.closesAt).getTime();

  useEffect(() => {
    let active = true;
    fetch("/api/drive/session")
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (!active) return;
        setReady(result?.ready === true);
        setLocalTestMode(result?.localTestMode === true);
        if (result?.localTestMode === true) setTurnstileToken("local-test");
        setSiteKey(typeof result?.turnstileSiteKey === "string" ? result.turnstileSiteKey : "");
      })
      .catch(() => { if (active) setReady(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!siteKey || !challengeRef.current) return;
    const scriptUrl = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    let script = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);
    let addedScript = false;
    const render = () => {
      if (!window.turnstile || !challengeRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(challengeRef.current, {
        sitekey: siteKey, action: "memory_upload", theme: "dark",
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };
    if (!script) {
      script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      addedScript = true;
    }
    script.addEventListener("load", render);
    if (window.turnstile) render();
    return () => {
      script?.removeEventListener("load", render);
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = undefined;
      if (addedScript) script?.remove();
    };
  }, [siteKey]);

  useEffect(() => {
    if (!albumRequested) return;
    let active = true;
    const secret = window.location.hash.slice(1);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    setGalleryMode(true);
    setGalleryLoading(true);
    setGalleryError("");
    const authorize = async () => {
      if (secret) {
        try {
          const access = await fetch("/api/drive/gallery/access", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret }),
          });
          if (!access.ok) throw new Error(language === "en" ? "This private link is invalid or expired." : "Este enlace privado no es válido o ya venció.");
        } catch (error) {
          if (active) setGalleryError(error instanceof Error ? error.message : "No se pudo abrir el álbum.");
          return;
        }
      }
      try {
        const response = await fetch("/api/drive/gallery/index");
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || (language === "en" ? "This private link is invalid or expired." : "Este enlace privado no es válido o ya venció."));
        if (active) setGalleryFiles(Array.isArray(result.files) ? result.files : []);
      } catch (error) {
        if (active) setGalleryError(error instanceof Error ? error.message : "No se pudo abrir el álbum.");
      } finally {
        if (active) setGalleryLoading(false);
      }
    };
    void authorize();
    return () => { active = false; };
  }, [albumRequested, language]);

  function select(event: ChangeEvent<HTMLInputElement>) {
    const selection = Array.from(event.target.files ?? []);
    const validation = validateFiles(selection);
    setErrors(language === "en" ? validation.map(() => "Please check that your selected files meet the format and size limits.") : validation);
    setFiles(selection);
    sessionsRef.current = null;
    attemptedRef.current = selection.map(() => false);
    completedRef.current = selection.map(() => false);
    setProgress(selection.map(() => 0));
    setUploadError("");
  }

  async function uploadFiles() {
    if (!files.length || errors.length || uploading || (!sessionsRef.current && !turnstileToken)) return;
    setUploading(true);
    setUploadError("");
    try {
      const uploads = files.map((file) => {
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
        return { name: file.name, type: file.type || mimeByExtension[extension] || "application/octet-stream", size: file.size };
      });
      if (!sessionsRef.current) {
        const sessionResponse = await fetch("/api/drive/session", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ files: uploads, turnstileToken }),
        });
        setTurnstileToken(localTestMode ? "local-test" : "");
        if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
        const result = await sessionResponse.json().catch(() => ({}));
        if (!sessionResponse.ok || !Array.isArray(result.sessions) || result.sessions.length !== files.length) {
          throw new Error(result.error || (language === "en" ? "The upload could not be started." : "No se pudo iniciar la carga."));
        }
        sessionsRef.current = result.sessions;
      }
      for (let index = 0; index < files.length; index += 1) {
        if (completedRef.current[index]) continue;
        const file = files[index];
        const { sessionUrl } = sessionsRef.current![index];
        const mimeType = uploads[index].type;
        const resume = attemptedRef.current[index];
        attemptedRef.current[index] = true;
        await uploadResumable(file, sessionUrl, mimeType, resume, (value) => setProgress((current) => current.map((old, item) => item === index ? value : old)));
        completedRef.current[index] = true;
      }
    } catch (error) {
      setUploadError(error instanceof Error && error.message === "session-unavailable"
        ? (language === "en" ? "This upload session is no longer available. Check Drive before selecting the files again." : "La sesión de carga ya no está disponible. Revisa Drive antes de volver a seleccionar los archivos.")
        : sessionsRef.current ? (language === "en" ? "Upload interrupted. Check your connection and retry without reloading this page." : "La carga se interrumpió. Revisa tu conexión y vuelve a intentarlo sin recargar esta página.") : (error instanceof Error ? error.message : (language === "en" ? "Upload failed." : "La carga falló.")));
    } finally {
      setUploading(false);
    }
  }

  const isVideo = (file: GalleryFile) => file.type.startsWith("video/");
  return (
    <main className="memories-page">
      <div className="language-switch memories-language-switch" role="group" aria-label={t("header.switch")}>
        <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>En</button><span aria-hidden="true">|</span>
        <button type="button" aria-pressed={language === "es"} onClick={() => setLanguage("es")}>Es</button>
      </div>
      <a href="/" className="back-link"><ArrowLeft size={17} /> {t("memories.back")}</a>
      <div className={galleryMode ? "gallery-content" : "upload-content"}>
        {galleryMode ? <>
          <LockKeyhole size={32} strokeWidth={1} className="gold-icon" />
          <p className="eyebrow">{language === "en" ? "A private album" : "Un álbum privado"}</p>
          <h1>{language === "en" ? <>Our night.<br /><em>Our memories.</em></> : <>Nuestra noche.<br /><em>Nuestros recuerdos.</em></>}</h1>
          <p>{language === "en" ? "A collection of moments shared by the people who celebrated with Camila." : "Momentos compartidos por quienes celebraron con Camila."}</p>
          {galleryLoading ? <div className="upload-notice" role="status">{language === "en" ? "Opening the private album…" : "Abriendo el álbum privado…"}</div> : null}
          {galleryError ? <div className="upload-notice" role="alert">{galleryError}</div> : null}
          {!galleryLoading && !galleryError && galleryFiles.length === 0 ? <div className="upload-notice" role="status">{language === "en" ? "No memories have been shared yet." : "Todavía no se han compartido recuerdos."}</div> : null}
          <div className="memory-grid">{galleryFiles.map((file) => <figure className="memory-item" key={file.id}>
            {isVideo(file) ? <video src={file.mediaUrl} controls preload="none" playsInline aria-label={file.name} /> : <a href={file.mediaUrl} target="_blank" rel="noreferrer"><img src={file.mediaUrl} loading="lazy" alt={file.name} /></a>}
            <figcaption>{file.name}</figcaption>
          </figure>)}</div>
        </> : <>
          <Camera size={35} strokeWidth={1} className="gold-icon" />
          <p className="eyebrow">{language === "en" ? "Camila's quinceañera" : `Los XV de ${invitation.honoree}`}</p>
          <h1>{t("memories.title1")}<br /><em>{t("memories.page.title2")}</em></h1>
          <p>{t("memories.intro")}</p>
          {closed || !ready ? <div className="upload-notice" role="status">{closed ? t("memories.closed") : t("memories.pending")}</div> : null}
          {!closed && ready ? <>
            <label className="file-picker">
              <ImagePlus size={27} strokeWidth={1} /><strong>{t("memories.select")}</strong><span>{t("memories.select.copy")}</span>
              <input aria-label={t("memories.select.aria")} type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm,video/x-m4v,.heic,.heif,.mov,.m4v" disabled={uploading} onChange={select} />
            </label>
            <p className="form-note">{t("memories.limits")}</p>
            {!localTestMode ? <div className="turnstile-widget" ref={challengeRef} aria-label={language === "en" ? "Security check" : "Verificación de seguridad"} /> : null}
            {errors.length ? <ul className="form-error" role="alert">{errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}
            {files.length ? <div className="selected-files">
              <p>{files.length} {t("memories.selected")}</p>
              <ul>{files.map((file, index) => <li key={`${file.name}-${index}`}>
                <SelectedPreview file={file} language={language} progress={progress[index] ?? 0} />
                <progress className="sr-only" value={progress[index]} max={100} aria-label={`${file.name}: ${progress[index]}%`} />
              </li>)}</ul>
              {uploadError ? <p className="form-error" role="alert">{uploadError}</p> : null}
              <button className="upload-submit" type="button" disabled={uploading || (!sessionsRef.current && !turnstileToken) || progress.every((value) => value === 100)} onClick={uploadFiles}>
                {uploading ? (language === "en" ? "Uploading…" : "Subiendo…") : !sessionsRef.current && !turnstileToken ? (language === "en" ? "Complete the security check" : "Completa la verificación") : (language === "en" ? "Upload memories" : "Subir recuerdos")}
              </button>
            </div> : null}
          </> : null}
          <p className="form-note">{t("memories.private")}</p>
        </>}
      </div>
    </main>
  );
}
