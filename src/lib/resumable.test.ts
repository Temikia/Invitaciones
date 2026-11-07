import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadResumable } from "./resumable";

afterEach(() => vi.unstubAllGlobals());

describe("carga reanudable", () => {
  it("consulta el estado y continúa después de un corte", async () => {
    const file = new File([new Uint8Array(524288)], "video.mp4", { type: "video/mp4" });
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 308, headers: { Range: "bytes=0-262143" } }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const progress = vi.fn();
    await uploadResumable(file, "https://example.test/session", file.type, true, progress);
    expect(fetchMock.mock.calls[0][1].headers["Content-Range"]).toBe("bytes */524288");
    expect(fetchMock.mock.calls[1][1].headers["Content-Range"]).toBe("bytes 262144-524287/524288");
    expect(progress).toHaveBeenLastCalledWith(100);
  });

  it("reconoce un archivo ya terminado sin volver a subirlo", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await uploadResumable(new File(["abc"], "foto.png"), "https://example.test/session", "image/png", true, vi.fn());
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("no informa éxito cuando se pierde la conexión", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    const progress = vi.fn();
    await expect(uploadResumable(new File(["abc"], "foto.png"), "https://example.test/session", "image/png", false, progress)).rejects.toThrow();
    expect(progress).not.toHaveBeenCalledWith(100);
  });

  it("muestra bytes enviados sin marcar 100 % antes de la confirmación", async () => {
    class FakeRequest {
      upload: { onprogress?: (event: { lengthComputable: boolean; loaded: number }) => void } = {};
      onload?: () => void;
      status = 200;
      open() {}
      setRequestHeader() {}
      getResponseHeader() { return null; }
      send() {
        queueMicrotask(() => {
          this.upload.onprogress?.({ lengthComputable: true, loaded: 5 });
          this.upload.onprogress?.({ lengthComputable: true, loaded: 10 });
          this.onload?.();
        });
      }
    }
    vi.stubGlobal("XMLHttpRequest", FakeRequest);
    const progress = vi.fn();
    await uploadResumable(new File(["0123456789"], "foto.png"), "https://example.test/session", "image/png", false, progress);
    expect(progress.mock.calls.map(([value]) => value)).toEqual([50, 99, 100]);
  });

  it("revierte el avance no confirmado si se corta la conexión", async () => {
    class BrokenRequest {
      upload: { onprogress?: (event: { lengthComputable: boolean; loaded: number }) => void } = {};
      onerror?: () => void;
      open() {}
      setRequestHeader() {}
      send() { queueMicrotask(() => { this.upload.onprogress?.({ lengthComputable: true, loaded: 5 }); this.onerror?.(); }); }
    }
    vi.stubGlobal("XMLHttpRequest", BrokenRequest);
    const progress = vi.fn();
    await expect(uploadResumable(new File(["0123456789"], "foto.png"), "https://example.test/session", "image/png", false, progress)).rejects.toThrow();
    expect(progress.mock.calls.map(([value]) => value)).toEqual([50, 0]);
  });
});
