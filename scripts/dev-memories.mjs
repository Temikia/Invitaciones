// Local-only development server. This file is never used by the deployed API.
import http from "node:http";
import { randomBytes } from "node:crypto";
import { createServer } from "vite";
import { getDriveAccessToken, sendJson, validateUpload } from "../server/drive.js";
import galleryIndex from "../api/drive/gallery/index.js";
import galleryMedia from "../api/drive/gallery/media.js";
import sessionHandler from "../api/drive/session.js";

const host = "127.0.0.1";
const port = 5188;
const origin = `http://${host}:${port}`;
const securityTest = process.argv.includes("--security");
if (securityTest) {
  if (!process.env.LOCAL_TURNSTILE_SITE_KEY || !process.env.LOCAL_TURNSTILE_SECRET_KEY || !process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN || !process.env.ABUSE_HASH_SECRET) {
    throw new Error("Faltan las claves locales de Turnstile o la configuración de Upstash.");
  }
  process.env.TURNSTILE_SITE_KEY = process.env.LOCAL_TURNSTILE_SITE_KEY;
  process.env.TURNSTILE_SECRET_KEY = process.env.LOCAL_TURNSTILE_SECRET_KEY;
  process.env.DRIVE_UPLOADS_ENABLED = "true";
}
// Ephemeral, process-local quota substitute for local testing only.
if (!securityTest) {
  process.env.ABUSE_HASH_SECRET = randomBytes(32).toString("base64url");
  process.env.UPSTASH_REDIS_REST_URL = "https://local-redis.invalid";
  process.env.UPSTASH_REDIS_REST_TOKEN = randomBytes(32).toString("base64url");
}
const counters = new Map();
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  if (url !== "https://local-redis.invalid/pipeline") return realFetch(url, options);
  const commands = JSON.parse(options.body);
  const key = commands[0][1];
  const count = (counters.get(key) ?? 0) + 1;
  counters.set(key, count);
  // Discard old minute buckets to keep the local process bounded.
  if (counters.size > 500) counters.clear();
  return Response.json([{ result: count }, { result: 1 }]);
};
const vite = await createServer({ server: { middlewareMode: true }, appType: "spa" });
const configured = () => Boolean(process.env.DRIVE_FOLDER_ID && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_SECRET && process.env.GOOGLE_REFRESH_TOKEN);

const server = http.createServer(async (req, res) => {
  if (req.headers.host !== `${host}:${port}` || !["127.0.0.1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress)) {
    return sendJson(res, 403, { error: "Acceso local únicamente." });
  }
  const path = new URL(req.url, origin).pathname;
  // Compatibilidad con el acceso local anterior; el álbum ya no requiere enlace secreto.
  if (path === "/album-local") {
    res.writeHead(302, { Location: "/album", "Cache-Control": "no-store" });
    return res.end();
  }
  const galleryHandlers = { "/api/drive/gallery/index": galleryIndex, "/api/drive/gallery/media": galleryMedia };
  if (galleryHandlers[path]) {
    req.headers["x-real-ip"] = "127.0.0.1";
    req.headers["x-forwarded-host"] = `${host}:${port}`;
    req.headers["x-forwarded-proto"] = "http";
    if (req.method === "POST") {
      try {
        let body = "";
        for await (const chunk of req) {
          body += chunk;
          if (body.length > 32768) return sendJson(res, 413, { error: "Solicitud demasiado grande." });
        }
        req.body = JSON.parse(body);
      } catch { return sendJson(res, 400, { error: "Solicitud inválida." }); }
    }
    return galleryHandlers[path](req, res);
  }
  if (path !== "/api/drive/session") return vite.middlewares(req, res);
  if (securityTest) {
    req.headers["x-real-ip"] = "127.0.0.1";
    req.headers["x-forwarded-host"] = `${host}:${port}`;
    if (req.method === "POST") {
      try {
        let body = "";
        for await (const chunk of req) {
          body += chunk;
          if (body.length > 32768) return sendJson(res, 413, { error: "Solicitud demasiado grande." });
        }
        req.body = JSON.parse(body);
      } catch { return sendJson(res, 400, { error: "Solicitud inválida." }); }
    }
    return sessionHandler(req, res);
  }
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
        headers: { Authorization: `Bearer ${token}`, Origin: origin, "Content-Type": "application/json; charset=UTF-8", "X-Upload-Content-Type": upload.mimeType, "X-Upload-Content-Length": String(upload.size) },
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
