import { getDriveAccessToken, sendJson, validateUpload } from "../../server/drive.js";

const CLOSES_AT = Date.parse("2026-12-07T00:00:00-07:00");

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "GET") {
    const configured = process.env.DRIVE_UPLOADS_ENABLED === "true"
      && Boolean(process.env.DRIVE_FOLDER_ID && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
    return sendJson(res, 200, { ready: configured && Date.now() < CLOSES_AT });
  }
  if (req.method !== "POST") return sendJson(res, 405, { error: "Método no permitido." });
  const requestOrigin = req.headers.origin;
  const requestHost = req.headers["x-forwarded-host"] ?? req.headers.host;
  if (!requestOrigin || !requestHost) return sendJson(res, 403, { error: "Origen no permitido." });
  try {
    const origin = new URL(requestOrigin);
    if (origin.host.toLowerCase() !== String(requestHost).toLowerCase() || !["https:", "http:"].includes(origin.protocol)) {
      return sendJson(res, 403, { error: "Origen no permitido." });
    }
  } catch {
    return sendJson(res, 403, { error: "Origen no permitido." });
  }
  if (process.env.DRIVE_UPLOADS_ENABLED !== "true") {
    return sendJson(res, 503, { error: "Las cargas todavía no están habilitadas." });
  }
  if (Date.now() >= CLOSES_AT) return sendJson(res, 410, { error: "El periodo de carga terminó." });

  const upload = validateUpload(req.body);
  if (!upload) return sendJson(res, 400, { error: "Archivo inválido o fuera de los límites permitidos." });
  if (!process.env.DRIVE_FOLDER_ID) return sendJson(res, 503, { error: "La carpeta de recuerdos no está configurada." });

  try {
    const accessToken = await getDriveAccessToken();
    const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,mimeType,size", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    if (!response.ok || !sessionUrl) {
      return sendJson(res, 502, { error: "Google Drive no pudo iniciar la carga." });
    }
    const parsedSession = new URL(sessionUrl);
    if (parsedSession.protocol !== "https:" || parsedSession.hostname !== "www.googleapis.com") {
      return sendJson(res, 502, { error: "Google Drive devolvió una sesión inválida." });
    }
    return sendJson(res, 201, { sessionUrl, size: upload.size });
  } catch {
    return sendJson(res, 503, { error: "No se pudo autorizar la carga con Google Drive." });
  }
}
