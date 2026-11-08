import { createHmac } from "node:crypto";

const WINDOW_SECONDS = 60;
const MAX_BATCHES_PER_WINDOW = 4;

export function requestOriginAllowed(req) {
  const origin = req.headers.origin;
  const host = req.headers["x-forwarded-host"] ?? req.headers.host;
  if (!origin || !host) return false;
  try {
    const parsed = new URL(origin);
    return parsed.host.toLowerCase() === String(host).toLowerCase()
      && ["https:", "http:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export async function verifyTurnstile(req, token) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || typeof token !== "string" || token.length > 2048) return false;
  const form = new URLSearchParams({ secret, response: token });
  const ip = req.headers["x-real-ip"];
  if (typeof ip === "string" && ip.length < 64) form.set("remoteip", ip);
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
      signal: AbortSignal.timeout(5000),
    });
    const result = await response.json();
    const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "").split(":")[0].toLowerCase();
    return response.ok && result.success === true && result.action === "memory_upload" && result.hostname === host;
  } catch {
    return false;
  }
}

export async function allowUploadBatch(req) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const ip = req.headers["x-real-ip"];
  if (!url || !token || typeof ip !== "string" || ip.length > 64) return false;
  const secret = process.env.ABUSE_HASH_SECRET;
  if (!secret || secret.length < 32) return false;
  const digest = createHmac("sha256", secret).update(ip).digest("hex");
  const key = `camila:upload:${digest}:${Math.floor(Date.now() / (WINDOW_SECONDS * 1000))}`;
  try {
    const response = await fetch(`${url.replace(/\/$/u, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", key], ["EXPIRE", key, WINDOW_SECONDS]]),
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return false;
    const results = await response.json();
    const count = Number(results?.[0]?.result);
    return Number.isSafeInteger(count) && count <= MAX_BATCHES_PER_WINDOW;
  } catch {
    return false;
  }
}

export async function allowGalleryRead(req) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const ip = req.headers["x-real-ip"];
  const secret = process.env.ABUSE_HASH_SECRET;
  if (!url || !token || typeof ip !== "string" || ip.length > 64 || !secret || secret.length < 32) return false;
  const digest = createHmac("sha256", secret).update(ip).digest("hex");
  const key = `camila:gallery:${digest}:${Math.floor(Date.now() / (WINDOW_SECONDS * 1000))}`;
  try {
    const response = await fetch(`${url.replace(/\/$/u, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", key], ["EXPIRE", key, WINDOW_SECONDS]]),
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return false;
    const results = await response.json();
    const count = Number(results?.[0]?.result);
    return Number.isSafeInteger(count) && count <= 120;
  } catch {
    return false;
  }
}
