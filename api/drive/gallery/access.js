import { galleryCookieHeader, createGalleryCookie, requestOriginAllowed, secretMatches } from "../../../server/security.js";
import { sendJson } from "../../../server/drive.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return sendJson(res, 405, { error: "Método no permitido." });
  if (!requestOriginAllowed(req)) return sendJson(res, 403, { error: "Origen no permitido." });
  const secret = process.env.MEMORIES_GALLERY_SECRET;
  if (!secret || secret.length < 32) return sendJson(res, 503, { error: "La galería privada todavía no está configurada." });
  if (!secretMatches(req.body?.secret, secret)) return sendJson(res, 403, { error: "El enlace de la galería no es válido." });
  const secure = (req.headers["x-forwarded-proto"] ?? "https") === "https";
  res.setHeader("Set-Cookie", galleryCookieHeader(createGalleryCookie(secret), secure));
  return sendJson(res, 200, { authorized: true });
}
