import { useState, type ChangeEvent } from "react";
import { ArrowLeft, Camera, ImagePlus } from "lucide-react";
import { invitation } from "../config/invitation";
import { validateFiles } from "../lib/event";
import { useLanguage } from "../config/language";

export default function Memories() {
  const { language, setLanguage, t } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const closed = Date.now() >= new Date(invitation.uploads.closesAt).getTime();
  function select(event: ChangeEvent<HTMLInputElement>) {
    const selection = Array.from(event.target.files ?? []);
    const validation = validateFiles(selection);
    setErrors(language === "en" ? validation.map(() => "Please check that your selected files meet the format and size limits.") : validation);
    setFiles(selection);
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
          {closed
            ? t("memories.closed")
            : t("memories.pending")}
        </div>
        {!closed ? (
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
                  {files.length} {t("memories.selected")} {t("memories.sent")}
                </p>
                <ul>
                  {files.map((file, index) => (
                    <li key={`${file.name}-${index}`}>
                      <span>{file.name}</span>
                      <small>{(file.size / 1024 ** 2).toFixed(1)} MB</small>
                    </li>
                  ))}
                </ul>
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
