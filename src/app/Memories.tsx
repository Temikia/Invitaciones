import { useEffect, useState, type ChangeEvent } from "react";
import { ArrowLeft, Camera, ImagePlus } from "lucide-react";
import { invitation } from "../config/invitation";
import { validateFiles } from "../lib/event";
import { useLanguage } from "../config/language";

const mimeByExtension: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
  heic: "image/heic", heif: "image/heif", mp4: "video/mp4",
  mov: "video/quicktime", webm: "video/webm", m4v: "video/mp4",
};

export default function Memories() {
  const { language, setLanguage, t } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [ready, setReady] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number[]>([]);
  const [uploadError, setUploadError] = useState("");
  const closed = Date.now() >= new Date(invitation.uploads.closesAt).getTime();
  useEffect(() => {
    let active = true;
    fetch("/api/drive/session")
      .then((response) => response.ok ? response.json() : null)
      .then((result) => { if (active) setReady(result?.ready === true); })
      .catch(() => { if (active) setReady(false); });
    return () => { active = false; };
  }, []);
  function select(event: ChangeEvent<HTMLInputElement>) {
    const selection = Array.from(event.target.files ?? []);
    const validation = validateFiles(selection);
    setErrors(language === "en" ? validation.map(() => "Please check that your selected files meet the format and size limits.") : validation);
    setFiles(selection);
    setProgress(selection.map(() => 0));
    setUploadError("");
  }

  async function uploadFiles() {
    if (!files.length || errors.length || uploading) return;
    setUploading(true);
    setUploadError("");
    try {
      for (let index = 0; index < files.length; index += 1) {
        if (progress[index] === 100) continue;
        const file = files[index];
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
        const mimeType = file.type || mimeByExtension[extension] || "application/octet-stream";
        const sessionResponse = await fetch("/api/drive/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: file.name, type: mimeType, size: file.size }),
        });
        if (!sessionResponse.ok) {
          const result = await sessionResponse.json().catch(() => ({}));
          throw new Error(result.error || (language === "en" ? "The upload could not be started." : "No se pudo iniciar la carga."));
        }
        const { sessionUrl } = await sessionResponse.json();
        let offset = 0;
        const chunkSize = 8 * 1024 * 1024;
        while (offset < file.size) {
          const end = Math.min(offset + chunkSize, file.size);
          let response: Response;
          try {
            response = await fetch(sessionUrl, {
              method: "PUT",
              headers: {
                "Content-Range": `bytes ${offset}-${end - 1}/${file.size}`,
                "Content-Type": mimeType,
              },
              body: file.slice(offset, end),
            });
          } catch {
            const status = await fetch(sessionUrl, {
              method: "PUT",
              headers: { "Content-Range": `bytes */${file.size}` },
            });
            if (status.status === 200 || status.status === 201) {
              offset = file.size;
              break;
            }
            if (status.status !== 308) throw new Error(language === "en" ? "The connection was interrupted. Retry this file." : "La conexión se interrumpió. Intenta de nuevo este archivo.");
            const range = status.headers.get("Range");
            offset = range ? Number(range.split("-").pop()) + 1 : 0;
            continue;
          }
          if (response.status === 308) {
            const range = response.headers.get("Range");
            offset = range ? Number(range.split("-").pop()) + 1 : end;
          } else if (response.ok) {
            offset = file.size;
          } else {
            throw new Error(language === "en" ? "Google Drive rejected this file." : "Google Drive rechazó este archivo.");
          }
          setProgress((current) => current.map((value, item) => item === index ? Math.min(100, Math.round((offset / file.size) * 100)) : value));
        }
        setProgress((current) => current.map((value, item) => item === index ? 100 : value));
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : (language === "en" ? "Upload failed." : "La carga falló."));
    } finally {
      setUploading(false);
    }
  }
  return (
    <main className="memories-page">
      <div className="language-switch memories-language-switch" role="group" aria-label={t("header.switch")}>
        <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>En</button>
        <span aria-hidden="true">|</span>
        <button type="button" aria-pressed={language === "es"} onClick={() => setLanguage("es")}>Es</button>
      </div>
      <a href="/" className="back-link">
        <ArrowLeft size={17} /> {t("memories.back")}
      </a>
      <div className="upload-content">
        <Camera size={35} strokeWidth={1} className="gold-icon" />
        <p className="eyebrow">{language === "en" ? "Camila's quinceañera" : `Los XV de ${invitation.honoree}`}</p>
        <h1>
          {t("memories.title1")}
          <br />
          <em>{t("memories.page.title2")}</em>
        </h1>
        <p>{t("memories.intro")}</p>
        <div className="upload-notice" role="status">
          {closed ? t("memories.closed") : ready ? (language === "en" ? "Uploads are ready. Your files will be sent to the private Drive folder." : "Las cargas están listas. Tus archivos se enviarán a la carpeta privada de Drive.") : t("memories.pending")}
        </div>
        {!closed && ready ? (
          <>
            <label className="file-picker">
              <ImagePlus size={27} strokeWidth={1} />
              <strong>{t("memories.select")}</strong>
              <span>{t("memories.select.copy")}</span>
              <input
                aria-label={t("memories.select.aria")}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm,video/x-m4v,.heic,.heif,.mov,.m4v"
                disabled={uploading}
                onChange={select}
              />
            </label>
            <p className="form-note">
              {t("memories.limits")}
            </p>
            {errors.length ? (
              <ul className="form-error" role="alert">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            ) : null}
            {files.length ? (
              <div className="selected-files">
                <p>
                  {files.length} {t("memories.selected")}
                </p>
                <ul>
                  {files.map((file, index) => (
                    <li key={`${file.name}-${index}`}>
                      <div className="upload-file-progress">
                        <span>{file.name}</span>
                        <progress value={progress[index]} max={100} aria-label={`${file.name}: ${progress[index]}%`} />
                      </div>
                      <small>{progress[index]}% · {(file.size / 1024 ** 2).toFixed(1)} MB</small>
                    </li>
                  ))}
                </ul>
                {uploadError ? <p className="form-error" role="alert">{uploadError}</p> : null}
                <button className="upload-submit" type="button" disabled={uploading || progress.every((value) => value === 100)} onClick={uploadFiles}>
                  {uploading ? (language === "en" ? "Uploading…" : "Subiendo…") : (language === "en" ? "Upload memories" : "Subir recuerdos")}
                </button>
              </div>
            ) : null}
          </>
        ) : null}
        <p className="form-note">
          {t("memories.private")}
        </p>
      </div>
    </main>
  );
}
