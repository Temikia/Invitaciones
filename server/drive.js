const PHOTO_LIMIT = 20 * 1024 * 1024;
const VIDEO_LIMIT = 400 * 1024 * 1024;

const extensions = new Map([
  ["jpg", [["image/jpeg"], PHOTO_LIMIT]],
  ["jpeg", [["image/jpeg"], PHOTO_LIMIT]],
  ["png", [["image/png"], PHOTO_LIMIT]],
  ["webp", [["image/webp"], PHOTO_LIMIT]],
  ["heic", [["image/heic", "image/heic-sequence"], PHOTO_LIMIT]],
  ["heif", [["image/heif", "image/heif-sequence"], PHOTO_LIMIT]],
  ["mp4", [["video/mp4"], VIDEO_LIMIT]],
  ["mov", [["video/quicktime"], VIDEO_LIMIT]],
  ["webm", [["video/webm"], VIDEO_LIMIT]],
  ["m4v", [["video/x-m4v", "video/mp4"], VIDEO_LIMIT]],
]);

export function validateUpload(metadata) {
  if (!metadata || typeof metadata !== "object") return null;
  const name = typeof metadata.name === "string" ? metadata.name.trim() : "";
  const mimeType = typeof metadata.type === "string" ? metadata.type.toLowerCase() : "";
  const size = Number(metadata.size);
  const extension = name.split(".").pop()?.toLowerCase();
  const allowed = extensions.get(extension);
  if (!allowed || !allowed[0].includes(mimeType) || !Number.isSafeInteger(size) || size <= 0 || size > allowed[1]) return null;
  if (/[\u0000-\u001f\u007f/\\]/u.test(name) || name.length > 180) return null;
  return { name, mimeType, size };
}

export async function getDriveAccessToken() {
  const { GOOGLE_CLIENT_ID, GOOGLE_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error("Drive credentials are not configured.");
  }
  const body = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_SECRET,
    refresh_token: GOOGLE_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error("Drive authorization could not be refreshed.");
  const token = await response.json();
  if (typeof token.access_token !== "string") throw new Error("Google returned no access token.");
  return token.access_token;
}

export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}
