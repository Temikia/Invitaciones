// Local-only development server. This file is never used by the deployed API.
import http from "node:http";
import { createServer } from "vite";
import { getDriveAccessToken, sendJson, validateUpload } from "../server/drive.js";

const host = "127.0.0.1";
const port = 5188;
const origin = `http://${host}:${port}`;
const vite = await createServer({ server: { middlewareMode: true }, appType: "spa" });
const configured = () => Boolean(process.env.DRIVE_FOLDER_ID && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_SECRET && process.env.GOOGLE_REFRESH_TOKEN);

const server = http.createServer(async (req, res) => {
  if (req.headers.host !== `${host}:${port}` || !["127.0.0.1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress)) {
    return sendJson(res, 403, { error: "Acceso local únicamente." });
  }
  if (new URL(req.url, origin).pathname !== "/api/drive/session") return vite.middlewares(req, res);
  if (req.method === "GET") return sendJson(res, 200, { ready: configured() && Date.now() < Date.parse("2026-12-07T00:00:00-07:00"), localTestMode: true });
  if (req.method !== "POST" || req.headers.origin !== origin) return sendJson(res, 403, { error: "Origen no permitido." });
  if (!configured() || Date.now() >= Date.parse("2026-12-07T00:00:00-07:00")) return sendJson(res, 503, { error: "La prueba local no está disponible." });
  try {
    let body = "";
    for await (const chunk of req) {
      body += chunk;
      if (body.length > 32768) return sendJson(res, 413, { error: "Solicitud demasiado grande." });
    }
    const files = JSON.parse(body).files;
    if (!Array.isArray(files) || files.length < 1 || files.length > 20) return sendJson(res, 400, { error: "Selecciona entre 1 y 20 archivos." });
    const uploads = files.map(validateUpload);
    if (uploads.some((file) => !file)) return sendJson(res, 400, { error: "Hay un archivo inválido o fuera de los límites permitidos." });
    const token = await getDriveAccessToken();
    const sessions = [];
    for (const upload of uploads) {
      const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,mimeType,size", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=UTF-8", "X-Upload-Content-Type": upload.mimeType, "X-Upload-Content-Length": String(upload.size) },
        body: JSON.stringify({ name: upload.name, mimeType: upload.mimeType, parents: [process.env.DRIVE_FOLDER_ID], appProperties: { camilaMemoryUpload: "true" } }),
      });
      const sessionUrl = response.headers.get("location");
      if (!response.ok || !sessionUrl || new URL(sessionUrl).protocol !== "https:" || new URL(sessionUrl).hostname !== "www.googleapis.com") return sendJson(res, 502, { error: "Google Drive no pudo iniciar la carga." });
      sessions.push({ sessionUrl, size: upload.size });
    }
    return sendJson(res, 201, { sessions });
  } catch {
    return sendJson(res, 503, { error: "No se pudo iniciar la carga en Google Drive." });
  }
});
server.listen(port, host, () => console.log(`Prueba local de recuerdos: ${origin}/recuerdos`));
