import { useState, type ChangeEvent } from "react";
import { ArrowLeft, Camera, ImagePlus } from "lucide-react";
import { invitation } from "../config/invitation";
import { validateFiles } from "../lib/event";

export default function Memories() {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const closed = Date.now() >= new Date(invitation.uploads.closesAt).getTime();
  function select(event: ChangeEvent<HTMLInputElement>) {
    const selection = Array.from(event.target.files ?? []);
    setErrors(validateFiles(selection));
    setFiles(selection);
  }
  return (
    <main className="memories-page">
      <a href="/" className="back-link">
        <ArrowLeft size={17} /> Volver a la invitación
      </a>
      <div className="upload-content">
        <Camera size={35} strokeWidth={1} className="gold-icon" />
        <p className="eyebrow">Los XV de {invitation.honoree}</p>
        <h1>
          Una noche.
          <br />
          <em>Mil recuerdos.</em>
        </h1>
        <p>Comparte los instantes que quieras guardar de esta celebración.</p>
        <div className="upload-notice" role="status">
          {closed
            ? "El periodo para compartir recuerdos ha terminado. Gracias por acompañarnos."
            : "Estamos preparando el álbum privado. La carga estará disponible aquí en cuanto esté listo."}
        </div>
        {!closed ? (
          <>
            <label className="file-picker">
              <ImagePlus size={27} strokeWidth={1} />
              <strong>Seleccionar fotos y videos</strong>
              <span>Puedes revisar tus archivos antes de compartirlos.</span>
              <input
                aria-label="Seleccionar fotos y videos"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm,video/x-m4v,.heic,.heif,.mov,.m4v"
                onChange={select}
              />
            </label>
            <p className="form-note">
              Hasta 20 archivos por lote · Fotos de 20 MB · Videos de 400 MB
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
                  {files.length} archivo(s) seleccionado(s). Todavía no se han
                  enviado.
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
          Álbum privado, sin galería pública. Podrás compartir recuerdos hasta
          14 días después del evento; se conservarán durante 90 días.
        </p>
      </div>
    </main>
  );
}
