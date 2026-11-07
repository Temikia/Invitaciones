import { Readable } from "node:stream";
import { getDriveAccessToken, sendJson } from "../../../server/drive.js";
import { allowGalleryRead, hasGalleryAccess } from "../../../server/security.js";

const allowedTypes = new Set([
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
  "video/mp4", "video/quicktime", "video/webm", "video/x-m4v",
]);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET" && req.method !== "HEAD") return sendJson(res, 405, { error: "Método no permitido." });
  if (!hasGalleryAccess(req)) return sendJson(res, 401, { error: "Abre la galería desde su enlace privado." });
  if (!await allowGalleryRead(req)) return sendJson(res, 429, { error: "Se alcanzó el límite temporal de consultas." });
  const params = new URL(req.url, "https://internal.invalid").searchParams;
  const id = params.get("id") ?? "";
  const range = req.headers.range;
  if (!/^[\w-]{10,}$/u.test(id) || (range && !/^bytes=\d*-\d*$/u.test(range))) return sendJson(res, 400, { error: "Solicitud de archivo inválida." });
  if (!process.env.DRIVE_FOLDER_ID) return sendJson(res, 503, { error: "La carpeta de recuerdos no está configurada." });
  try {
    const accessToken = await getDriveAccessToken();
    const metadataResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?supportsAllDrives=true&fields=id,parents,appProperties,mimeType,size`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!metadataResponse.ok) return sendJson(res, 404, { error: "El archivo no está disponible." });
    const metadata = await metadataResponse.json();
    if (!metadata.parents?.includes(process.env.DRIVE_FOLDER_ID)
      || metadata.appProperties?.camilaMemoryUpload !== "true"
      || !allowedTypes.has(metadata.mimeType)) {
      return sendJson(res, 404, { error: "El archivo no está disponible." });
    }
    const headers = { Authorization: `Bearer ${accessToken}` };
    if (range) headers.Range = range;
    const upstream = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media&supportsAllDrives=true`, {
      method: req.method,
      headers,
    });
    if (!upstream.ok && upstream.status !== 206 && upstream.status !== 416) return sendJson(res, 502, { error: "Drive no pudo entregar el archivo." });
    res.statusCode = upstream.status;
    res.setHeader("Content-Type", metadata.mimeType);
    res.setHeader("Accept-Ranges", "bytes");
    for (const name of ["content-length", "content-range"]) {
      const value = upstream.headers.get(name);
      if (value) res.setHeader(name, value);
    }
    if (req.method === "HEAD" || !upstream.body) return res.end();
    Readable.fromWeb(upstream.body).pipe(res);
  } catch {
    if (!res.headersSent) return sendJson(res, 502, { error: "No se pudo entregar el archivo." });
    res.destroy();
  }
}
