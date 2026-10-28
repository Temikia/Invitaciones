import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const photos = resolve(root, "public/assets/production/photos");
const hero = await readFile(resolve(photos, "hero.svg"));
const embedded = hero.toString("utf8").match(/data:image\/webp;base64,([^"']+)/);
const source = embedded ? Buffer.from(embedded[1], "base64") : hero;

// Conserva el retrato entero; sus laterales se completan con la misma foto difuminada.
const portrait = await sharp(source)
  .resize({ width: 1200, height: 630, fit: "inside" })
  .png()
  .toBuffer();
await mkdir(photos, { recursive: true });
await sharp(source)
  .resize(1200, 630, { fit: "cover" })
  .blur(24)
  .modulate({ brightness: 0.45 })
  .composite([{ input: portrait, gravity: "centre" }])
  .flatten({ background: "#1b112b" })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(resolve(photos, "share-camila.jpg"));
console.log("Vista previa social preparada: photos/share-camila.jpg (1200 × 630).");
