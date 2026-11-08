import { getDriveAccessToken, sendJson } from "../../../server/drive.js";
import { allowGalleryRead } from "../../../server/security.js";

const allowedTypes = new Set([
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
  "video/mp4", "video/quicktime", "video/webm", "video/x-m4v",
]);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  if (req.method !== "GET") return sendJson(res, 405, { error: "Método no permitido." });
  if (!await allowGalleryRead(req)) return sendJson(res, 429, { error: "Se alcanzó el límite temporal de consultas." });
  if (!process.env.DRIVE_FOLDER_ID) return sendJson(res, 503, { error: "La carpeta de recuerdos no está configurada." });
  try {
    const accessToken = await getDriveAccessToken();
    const files = [];
    let pageToken;
    do {
      const params = new URLSearchParams({
        q: `'${process.env.DRIVE_FOLDER_ID}' in parents and trashed = false and appProperties has { key='camilaMemoryUpload' and value='true' }`,
        corpora: "allDrives",
        includeItemsFromAllDrives: "true",
        supportsAllDrives: "true",
        pageSize: "1000",
        orderBy: "createdTime desc",
        fields: "files(id,name,mimeType,size,createdTime),nextPageToken",
      });
      if (pageToken) params.set("pageToken", pageToken);
      const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw new Error("Drive listing failed.");
      const result = await response.json();
      for (const file of result.files ?? []) {
        if (!allowedTypes.has(file.mimeType) || !/^[\w-]{10,}$/u.test(file.id)) continue;
        files.push({
          id: file.id,
          name: String(file.name ?? "Recuerdo").slice(0, 180),
          type: file.mimeType,
          size: Number(file.size) || 0,
          createdTime: file.createdTime ?? null,
          mediaUrl: `/api/drive/gallery/media?id=${encodeURIComponent(file.id)}`,
        });
      }
      pageToken = result.nextPageToken;
    } while (pageToken);
    return sendJson(res, 200, { files });
  } catch {
    return sendJson(res, 502, { error: "No se pudieron consultar los recuerdos." });
  }
}
