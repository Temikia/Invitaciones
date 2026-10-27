import { mkdir, access } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
try {
  process.loadEnvFile(resolve(root, ".env"));
} catch (error) {
  if (error.code !== "ENOENT") throw new Error("No se pudo cargar .env.");
}
const key =
  process.env.AISTUDIO_GEMINI_API_KEY ||
  process.env.GEMINI_API ||
  process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const api = "https://generativelanguage.googleapis.com/v1beta";
const prompts = {
  forest: `Use case: original fantasy illustration. Asset type: full-screen portrait 9:16 background for an elegant quinceanera invitation. A cinematic painterly enchanted forest at midnight, tall ancient trees framing the left and right edges, deep midnight violet and almost black plum shadows, delicate warm gold fireflies drifting between branches, restrained atmospheric haze and fine botanical detail. Mature romantic fairytale aesthetic, sophisticated and immersive, subtle brushwork and rich depth. Keep a large dark quiet negative space in the center and upper center for a flower emblem and a name that will be composited later. The forest floor is shadowy and the central path barely visible. Luminous gold accents are sparse, never brightening the center. Edge-to-edge landscape artwork, no frame. No people, no animals, no faces, no text, no lettering, no typography, no logos, no visible watermark. Original setting, not a replica of any film still.`,
  lake: `Use case: original fantasy illustration. Asset type: full-screen portrait 9:16 background for an elegant quinceanera invitation. A cinematic painterly tranquil enchanted lake at violet-black twilight. The distant shoreline sits low in the composition, with an original barely visible fantasy village and a slender palace silhouette far away, tiny warm golden window lights reflected as delicate long trails in dark still water. Very subtle distant floating golden lights, sparse and poetic. The upper half is a deep dark plum-violet night sky with quiet negative space for a name to be composited later; no large moon. Mature romantic fairytale aesthetic, sophisticated and atmospheric, subtle brushwork and rich depth. Cool deep purple water and restrained amber-gold glow. Edge-to-edge landscape artwork, no frame. No people, no animals, no boats, no faces, no text, no lettering, no typography, no logos, no visible watermark. Original setting, not a replica of any film still.`,
};

async function request(path, body) {
  let response;
  try {
    response = await fetch(`${api}/${path}`, {
      method: body ? "POST" : "GET",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(180_000),
    });
  } catch {
    throw new Error(
      "No fue posible conectar con Google; revisa red y permisos.",
    );
  }
  // Never log raw API errors: request diagnostics can include sensitive metadata.
  if (!response.ok) {
    let status = "";
    try {
      status = (await response.json()).error?.status || "";
    } catch {
      /* HTTP status is enough. */
    }
    const safeStatus = /^[A-Z_]+$/.test(status) ? ` (${status})` : "";
    throw new Error(
      `Google respondió HTTP ${response.status}${safeStatus}. No se reintentó con otro modelo.`,
    );
  }
  return response.json();
}

async function main() {
  if (!key)
    throw new Error(
      "Configura AISTUDIO_GEMINI_API_KEY, GEMINI_API o GEMINI_API_KEY en .env.",
    );
  if (!/^[a-z0-9.-]+$/.test(model))
    throw new Error("Identificador de modelo inválido.");
  const models = await request("models");
  if (process.argv.includes("--list-models")) {
    console.log(
      models.models
        ?.filter((entry) => /image|imagen/.test(entry.name))
        .map((entry) => entry.name)
        .join("\n") || "No hay modelos de imagen disponibles.",
    );
    return;
  }
  if (
    !models.models?.some(
      (entry) =>
        entry.name === `models/${model}` &&
        entry.supportedGenerationMethods?.includes("generateContent"),
    )
  ) {
    throw new Error(
      "El modelo seleccionado no está disponible para esta clave. Consulta --list-models.",
    );
  }
  const { default: sharp } = await import("sharp");
  const output = resolve(root, "public/assets/production/backgrounds");
  await mkdir(output, { recursive: true });
  for (const [name, prompt] of Object.entries(prompts)) {
    const target = resolve(output, `${name}.webp`);
    if (!process.argv.includes("--overwrite")) {
      try {
        await access(target);
        console.log(`${name}: ya existe; se conserva.`);
        continue;
      } catch {
        /* Generate missing asset. */
      }
    }
    console.log(`Generando ${name} con Google ${model}…`);
    const result = await request(`models/${model}:generateContent`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: "9:16" },
      },
    });
    const part = result.candidates
      ?.flatMap((candidate) => candidate.content?.parts || [])
      .find((item) => item.inlineData?.mimeType?.startsWith("image/"));
    if (!part?.inlineData?.data)
      throw new Error(`Google no entregó una imagen para ${name}.`);
    const info = await sharp(Buffer.from(part.inlineData.data, "base64"))
      .resize(1080, 1920, { fit: "cover" })
      .webp({ quality: 88 })
      .toFile(target);
    console.log(
      `${name}.webp: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KiB.`,
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
