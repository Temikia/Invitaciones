import { invitation } from "../config/invitation";

export function getCountdown(now: number, target: string) {
  const end = Date.parse(target);
  if (!Number.isFinite(now) || !Number.isFinite(end)) {
    throw new Error("La cuenta regresiva requiere fechas válidas.");
  }
  const total = Math.max(0, Math.floor((end - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** Noviembre, con semanas completas de lunes a domingo; null indica otro mes. */
export function getNovemberCalendar(year: number): (number | null)[] {
  if (!Number.isInteger(year) || year < 100 || year > 9999) {
    throw new Error(
      "El año del calendario debe tener entre tres y cuatro cifras.",
    );
  }
  const offset = (new Date(Date.UTC(year, 10, 1)).getUTCDay() + 6) % 7;
  const length = Math.ceil((offset + 30) / 7) * 7;
  return Array.from({ length }, (_, index) => {
    const day = index - offset + 1;
    return day >= 1 && day <= 30 ? day : null;
  });
}

type RsvpConfig = {
  whatsapp: string;
  honoree: string;
  maxGuests?: number | null;
};

export function buildWhatsAppUrl(
  name: string,
  count: number,
  config: RsvpConfig = invitation,
): string {
  if (
    typeof name !== "string" ||
    !name.trim() ||
    /[\u0000-\u001f\u007f]/u.test(name)
  ) {
    throw new Error(
      "Escribe tu nombre sin saltos de línea ni caracteres de control.",
    );
  }
  if (!Number.isSafeInteger(count) || count < 1) {
    throw new Error(
      "Indica una cantidad entera de asistentes, de al menos una persona.",
    );
  }
  if (config.maxGuests != null && count > config.maxGuests) {
    throw new Error(`El máximo de asistentes es ${config.maxGuests}.`);
  }
  if (!/^\d{8,15}$/.test(config.whatsapp)) {
    throw new Error("El teléfono de confirmación no es válido.");
  }
  const cleanName = name.trim().replace(/\s+/gu, " ");
  const message = `Hola, soy ${cleanName}. Confirmo mi asistencia a los XV de ${config.honoree}. Asistiremos ${count} ${count === 1 ? "persona" : "personas"} en total. ¡Gracias por invitarnos!`;
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
}

type UploadFile = { name: string; type: string; size: number };
const formats: Record<
  string,
  { kind: "photo" | "video"; types: readonly string[] }
> = {
  jpg: { kind: "photo", types: ["image/jpeg"] },
  jpeg: { kind: "photo", types: ["image/jpeg"] },
  png: { kind: "photo", types: ["image/png"] },
  webp: { kind: "photo", types: ["image/webp"] },
  heic: { kind: "photo", types: ["image/heic", "image/heic-sequence"] },
  heif: { kind: "photo", types: ["image/heif", "image/heif-sequence"] },
  mp4: { kind: "video", types: ["video/mp4"] },
  mov: { kind: "video", types: ["video/quicktime"] },
  webm: { kind: "video", types: ["video/webm"] },
  m4v: { kind: "video", types: ["video/x-m4v", "video/mp4"] },
};

/** Validación preliminar del navegador; el futuro backend debe verificar el contenido. */
export function validateFiles(files: readonly UploadFile[]): string[] {
  const errors: string[] = [];
  if (files.length === 0)
    errors.push("Selecciona al menos una foto o un video.");
  if (files.length > invitation.uploads.maxFiles)
    errors.push("Puedes seleccionar hasta 20 archivos por lote.");
  for (const file of files) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const format = Object.hasOwn(formats, extension)
      ? formats[extension]
      : undefined;
    if (
      !file.name.includes(".") ||
      !format ||
      (file.type && !format.types.includes(file.type.toLowerCase()))
    ) {
      errors.push(
        `${file.name}: usa fotos JPG, PNG, WEBP, HEIC o HEIF, o videos MP4, MOV, WEBM o M4V con su formato correcto.`,
      );
      continue;
    }
    if (!Number.isFinite(file.size) || file.size <= 0) {
      errors.push(
        `${file.name}: el archivo está vacío o su tamaño no es válido.`,
      );
      continue;
    }
    const max =
      format.kind === "photo"
        ? invitation.uploads.photoMaxBytes
        : invitation.uploads.videoMaxBytes;
    if (file.size > max)
      errors.push(
        `${file.name}: supera el límite de ${format.kind === "photo" ? "50 MB por foto" : "500 MB por video"}.`,
      );
  }
  return errors;
}
