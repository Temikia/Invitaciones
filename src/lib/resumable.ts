const CHUNK_SIZE = 8 * 1024 * 1024;

function confirmedOffset(response: Response, size: number): number {
  const range = response.headers.get("Range");
  if (!range) return 0;
  const match = /^bytes=0-(\d+)$/u.exec(range);
  const offset = match ? Number(match[1]) + 1 : NaN;
  if (!Number.isSafeInteger(offset) || offset <= 0 || offset > size) throw new Error("invalid-range");
  return offset;
}

export async function uploadResumable(file: File, url: string, mimeType: string, resume: boolean, onProgress: (percent: number) => void) {
  let offset = 0;
  if (resume) {
    const status = await fetch(url, { method: "PUT", headers: { "Content-Range": `bytes */${file.size}` } });
    if (status.status === 200 || status.status === 201) { onProgress(100); return; }
    if (status.status === 404 || status.status === 410) throw new Error("session-unavailable");
    if (status.status !== 308) throw new Error("status-unavailable");
    offset = confirmedOffset(status, file.size);
  }
  while (offset < file.size) {
    const end = Math.min(offset + CHUNK_SIZE, file.size);
    const response = await fetch(url, { method: "PUT", headers: { "Content-Range": `bytes ${offset}-${end - 1}/${file.size}`, "Content-Type": mimeType }, body: file.slice(offset, end) });
    if (response.status === 308) {
      const next = confirmedOffset(response, file.size);
      if (next <= offset) throw new Error("no-progress");
      offset = next;
      onProgress(Math.min(99, Math.floor(offset / file.size * 100)));
    } else if (response.ok) { onProgress(100); return; }
    else throw new Error("upload-rejected");
  }
  throw new Error("completion-unconfirmed");
}
