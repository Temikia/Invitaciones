const CHUNK_SIZE = 8 * 1024 * 1024;

type UploadResponse = Pick<Response, "status" | "ok" | "headers">;

function confirmedOffset(response: UploadResponse, size: number): number {
  const range = response.headers.get("Range");
  if (!range) return 0;
  const match = /^bytes=0-(\d+)$/u.exec(range);
  const offset = match ? Number(match[1]) + 1 : NaN;
  if (!Number.isSafeInteger(offset) || offset <= 0 || offset > size) throw new Error("invalid-range");
  return offset;
}

function sendChunk(url: string, file: File, mimeType: string, offset: number, end: number, onProgress: (percent: number) => void): Promise<UploadResponse> {
  const range = `bytes ${offset}-${end - 1}/${file.size}`;
  if (typeof XMLHttpRequest === "undefined") {
    return fetch(url, { method: "PUT", headers: { "Content-Range": range, "Content-Type": mimeType }, body: file.slice(offset, end) });
  }
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Range", range);
    request.setRequestHeader("Content-Type", mimeType);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.min(99, Math.floor((offset + Math.min(event.loaded, end - offset)) / file.size * 100)));
    };
    request.onload = () => {
      const headers = new Headers();
      const received = request.getResponseHeader("Range");
      if (received) headers.set("Range", received);
      resolve({ status: request.status, ok: request.status >= 200 && request.status < 300, headers });
    };
    request.onerror = () => reject(new Error("connection-lost"));
    request.onabort = () => reject(new Error("connection-lost"));
    request.send(file.slice(offset, end));
  });
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
    let response: UploadResponse;
    try {
      response = await sendChunk(url, file, mimeType, offset, end, onProgress);
    } catch (error) {
      onProgress(Math.min(99, Math.floor(offset / file.size * 100)));
      throw error;
    }
    if (response.status === 308) {
      const next = confirmedOffset(response, file.size);
      if (next <= offset) throw new Error("no-progress");
      offset = next;
      onProgress(Math.min(99, Math.floor(offset / file.size * 100)));
    } else if (response.ok) { onProgress(100); return; }
    else {
      onProgress(Math.min(99, Math.floor(offset / file.size * 100)));
      throw new Error("upload-rejected");
    }
  }
  throw new Error("completion-unconfirmed");
}
