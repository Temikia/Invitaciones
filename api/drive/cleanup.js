import { getDriveAccessToken, sendJson } from "../../server/drive.js";

const RETENTION_ENDS_AT = Date.parse("2027-03-07T00:00:00-07:00");

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.authorization !== `Bearer ${cronSecret}`) {
    return sendJson(res, 401, { error: "No autorizado." });
  }
  if (req.method !== "GET") return sendJson(res, 405, { error: "Método no permitido." });
  if (Date.now() < RETENTION_ENDS_AT) return sendJson(res, 200, { deleted: 0, status: "retention-period-active" });
  if (!process.env.DRIVE_FOLDER_ID) return sendJson(res, 503, { error: "La carpeta de recuerdos no está configurada." });

  try {
    const accessToken = await getDriveAccessToken();
    const q = `'${process.env.DRIVE_FOLDER_ID}' in parents and trashed = false and appProperties has { key='camilaMemoryUpload' and value='true' }`;
    let pageToken;
    let deleted = 0;
    do {
      const params = new URLSearchParams({
        q,
        corpora: "allDrives",
        includeItemsFromAllDrives: "true",
        supportsAllDrives: "true",
        pageSize: "1000",
        fields: "files(id),nextPageToken",
      });
      if (pageToken) params.set("pageToken", pageToken);
      const listed = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!listed.ok) throw new Error("Drive file listing failed.");
      const result = await listed.json();
      for (const file of result.files ?? []) {
        const removed = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}?supportsAllDrives=true`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!removed.ok) throw new Error("Drive file deletion failed.");
        deleted += 1;
      }
      pageToken = result.nextPageToken;
    } while (pageToken);
    return sendJson(res, 200, { deleted, status: "complete" });
  } catch {
    return sendJson(res, 502, { error: "No se pudo completar la limpieza de recuerdos." });
  }
}
