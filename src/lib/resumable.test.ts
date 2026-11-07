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
    expect(progress).not.toHaveBeenCalled();
  });
});
