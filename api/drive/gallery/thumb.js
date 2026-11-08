import sharp from "sharp";
import { findAlbumFile, getDriveAccessToken, isDriveId, sendJson } from "../../../server/drive.js";
import { allowGalleryRead } from "../../../server/security.js";

/** Lado mayor permitido, en píxeles: mosaico pequeño, mosaico grande y pantalla completa. */
export const THUMB_SIZES = new Set([480, 960, 1920]);

/** Originales más pesados que esto no se procesan en el servidor para no agotar memoria ni tiempo. */
const MAX_RESIZE_BYTES = 120 * 1024 * 1024;

/** Drive no genera miniaturas de algunas fotos muy grandes (≈50 MB); se reducen aquí desde el original. */
async function resizeOriginal(id, accessToken, size) {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media&supportsAllDrives=true`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  const input = Buffer.from(await response.arrayBuffer());
  return sharp(input, { failOn: "none" })
    .rotate()
    .resize(size, size, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
}

function sendImage(res, type, body) {
  res.statusCode = 200;
  res.setHeader("Content-Type", type);
  res.setHeader("Content-Length", String(body.length));
  // La miniatura no cambia; se guarda solo en el navegador del invitado durante un día.
  res.setHeader("Cache-Control", "private, max-age=86400");
  return res.end(body);
}

/**
 * Entrega la miniatura JPEG que Drive genera para fotos (incluido HEIC) y videos,
 * para no descargar originales de decenas de MB en el mosaico, el visor o la película.
 */
export default async function handler(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") return sendJson(res, 405, { error: "Método no permitido." });
  if (!await allowGalleryRead(req)) return sendJson(res, 429, { error: "Se alcanzó el límite temporal de consultas." });
  const params = new URL(req.url, "https://internal.invalid").searchParams;
  const id = params.get("id") ?? "";
  const size = Number(params.get("size") ?? 480);
  if (!isDriveId(id) || !THUMB_SIZES.has(size)) return sendJson(res, 400, { error: "Solicitud de miniatura inválida." });
  if (!process.env.DRIVE_FOLDER_ID) return sendJson(res, 503, { error: "La carpeta de recuerdos no está configurada." });
  try {
    const accessToken = await getDriveAccessToken();
    const metadata = await findAlbumFile(id, accessToken, "hasThumbnail,thumbnailLink");
    if (!metadata) return sendJson(res, 404, { error: "Miniatura no disponible." });
    if (metadata.hasThumbnail && typeof metadata.thumbnailLink === "string" && /=s\d+$/u.test(metadata.thumbnailLink)) {
      const upstream = await fetch(metadata.thumbnailLink.replace(/=s\d+$/u, `=s${size}`), { headers: { Authorization: `Bearer ${accessToken}` } });
      const type = upstream.headers.get("content-type") ?? "";
      if (upstream.ok && type.startsWith("image/")) return sendImage(res, type, Buffer.from(await upstream.arrayBuffer()));
    }
    // Sin miniatura de Drive: fotos se reducen desde el original; videos (o un archivo recién subido) responden 404.
    if (metadata.mimeType.startsWith("image/") && Number(metadata.size) > 0 && Number(metadata.size) <= MAX_RESIZE_BYTES) {
      const resized = await resizeOriginal(id, accessToken, size).catch(() => null);
      if (resized) return sendImage(res, "image/jpeg", resized);
    }
    return sendJson(res, 404, { error: "Miniatura no disponible." });
  } catch {
    if (!res.headersSent) return sendJson(res, 502, { error: "No se pudo entregar la miniatura." });
  }
}
