import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler from "../api/drive/session.js";

const env = {
  DRIVE_UPLOADS_ENABLED: "true", DRIVE_FOLDER_ID: "folder", GOOGLE_CLIENT_ID: "client", GOOGLE_SECRET: "secret",
  GOOGLE_REFRESH_TOKEN: "refresh", TURNSTILE_SITE_KEY: "site", TURNSTILE_SECRET_KEY: "challenge",
  UPSTASH_REDIS_REST_URL: "https://redis.example", UPSTASH_REDIS_REST_TOKEN: "redis", ABUSE_HASH_SECRET: "a".repeat(32),
};
const request = () => ({ method: "POST", headers: { host: "example.test", origin: "https://example.test", "x-real-ip": "192.0.2.5" }, body: { files: [{ name: "foto.png", type: "image/png", size: 100 }], turnstileToken: "token" } });
const response = () => ({ statusCode: 200, setHeader() {}, end(body) { this.body = JSON.parse(body); } });

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-06T20:00:00Z"));
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.useRealTimers(); });

describe("protección de cargas", () => {
  it("rechaza más de veinte archivos antes de consultar servicios", async () => {
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    const req = request(); req.body.files = Array.from({ length: 21 }, () => req.body.files[0]);
    const res = response(); await handler(req, res);
    expect(res.statusCode).toBe(400); expect(fetchMock).not.toHaveBeenCalled();
  });
  it("bloquea el quinto lote antes de contactar a Google", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json([{ result: 5 }, { result: 1 }])); vi.stubGlobal("fetch", fetchMock);
    const res = response(); await handler(request(), res);
    expect(res.statusCode).toBe(429); expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("bloquea la carga si el contador no responde", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline")); vi.stubGlobal("fetch", fetchMock);
    const res = response(); await handler(request(), res);
    expect(res.statusCode).toBe(429); expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("bloquea una verificación inválida sin contactar a Google", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json([{ result: 1 }, { result: 1 }])).mockResolvedValueOnce(Response.json({ success: false })); vi.stubGlobal("fetch", fetchMock);
    const res = response(); await handler(request(), res);
    expect(res.statusCode).toBe(403); expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("bloquea cuando falla la verificación de seguridad", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json([{ result: 1 }, { result: 1 }])).mockRejectedValueOnce(new Error("offline")); vi.stubGlobal("fetch", fetchMock);
    const res = response(); await handler(request(), res);
    expect(res.statusCode).toBe(403); expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("rechaza un desafío emitido para otro dominio", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json([{ result: 1 }, { result: 1 }])).mockResolvedValueOnce(Response.json({ success: true, action: "memory_upload", hostname: "other.test" })); vi.stubGlobal("fetch", fetchMock);
    const res = response(); await handler(request(), res);
    expect(res.statusCode).toBe(403); expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("solo inicia la sesión tras verificar cuota, dominio y desafío", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json([{ result: 1 }, { result: 1 }]))
      .mockResolvedValueOnce(Response.json({ success: true, action: "memory_upload", hostname: "example.test" }))
      .mockResolvedValueOnce(Response.json({ access_token: "temporary" }))
      .mockResolvedValueOnce(new Response(null, { status: 200, headers: { location: "https://www.googleapis.com/upload/test" } }));
    vi.stubGlobal("fetch", fetchMock);
    const res = response(); await handler(request(), res);
    expect(res.statusCode).toBe(201); expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock.mock.calls[3][1].headers.Origin).toBe("https://example.test");
  });
});
