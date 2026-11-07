import { getDriveAccessToken, sendJson, validateUpload } from "../../server/drive.js";
import { allowUploadBatch, requestOriginAllowed, verifyTurnstile } from "../../server/security.js";

const CLOSES_AT = Date.parse("2026-12-07T00:00:00-07:00");

function uploadsConfigured() {
  return process.env.DRIVE_UPLOADS_ENABLED === "true"
    && Boolean(process.env.DRIVE_FOLDER_ID && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_SECRET && process.env.GOOGLE_REFRESH_TOKEN)
    && Boolean(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY)
    && Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
    && typeof process.env.ABUSE_HASH_SECRET === "string" && process.env.ABUSE_HASH_SECRET.length >= 32;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "GET") {
    return sendJson(res, 200, { ready: uploadsConfigured() && Date.now() < CLOSES_AT, turnstileSiteKey: uploadsConfigured() ? process.env.TURNSTILE_SITE_KEY : null });
  }
  if (req.method !== "POST") return sendJson(res, 405, { error: "Método no permitido." });
  if (!requestOriginAllowed(req)) return sendJson(res, 403, { error: "Origen no permitido." });
  if (process.env.DRIVE_UPLOADS_ENABLED !== "true") return sendJson(res, 503, { error: "Las cargas todavía no están habilitadas." });
  if (Date.now() >= CLOSES_AT) return sendJson(res, 410, { error: "El periodo de carga terminó." });
  if (!process.env.DRIVE_FOLDER_ID || !uploadsConfigured()) return sendJson(res, 503, { error: "La protección de cargas todavía no está configurada." });

  const files = req.body?.files;
  if (!Array.isArray(files) || files.length < 1 || files.length > 20) {
    return sendJson(res, 400, { error: "Selecciona entre 1 y 20 archivos por lote." });
  }
  const uploads = files.map(validateUpload);
  if (uploads.some((upload) => !upload)) return sendJson(res, 400, { error: "Hay un archivo inválido o fuera de los límites permitidos." });
  if (!await allowUploadBatch(req)) return sendJson(res, 429, { error: "Se alcanzó el límite temporal de cargas. Inténtalo más tarde." });
  if (!await verifyTurnstile(req, req.body?.turnstileToken)) return sendJson(res, 403, { error: "Completa la verificación de seguridad e inténtalo de nuevo." });

  try {
    const accessToken = await getDriveAccessToken();
    const sessions = [];
    for (const upload of uploads) {
      const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,mimeType,size", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Origin: req.headers.origin,
          "Content-Type": "application/json; charset=UTF-8",
          "X-Upload-Content-Type": upload.mimeType,
          "X-Upload-Content-Length": String(upload.size),
        },
        body: JSON.stringify({
          name: upload.name,
          mimeType: upload.mimeType,
          parents: [process.env.DRIVE_FOLDER_ID],
          appProperties: { camilaMemoryUpload: "true" },
        }),
      });
      const sessionUrl = response.headers.get("location");
      if (!response.ok || !sessionUrl) return sendJson(res, 502, { error: "Google Drive no pudo iniciar todas las cargas del lote." });
      const parsedSession = new URL(sessionUrl);
      if (parsedSession.protocol !== "https:" || parsedSession.hostname !== "www.googleapis.com") {
        return sendJson(res, 502, { error: "Google Drive devolvió una sesión inválida." });
      }
      sessions.push({ sessionUrl, size: upload.size });
    }
    return sendJson(res, 201, { sessions });
  } catch {
    return sendJson(res, 503, { error: "No se pudo autorizar la carga con Google Drive." });
  }
}
