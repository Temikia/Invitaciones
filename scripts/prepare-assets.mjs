import sharp from "sharp";
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = resolve(root, "public/assets/production");
const arguments_ = process.argv.slice(2);
if (
  arguments_.length &&
  (arguments_.length !== 2 || arguments_[0] !== "--hero")
) {
  throw new Error(
    "Uso: node scripts/prepare-assets.mjs [--hero ruta-de-fotografía]",
  );
}

const photos = [
  ["Galería 1.jpeg", "gallery-1.webp"],
  ["Galeria 2.jpg", "gallery-2.webp"],
  ["galeria 3.jpg", "gallery-3.webp"],
  ["_55A1398_(2).jpg", "gallery-4.webp", "multimedia/Fotos XV Pri/Fotos XV Pri"],
  ["galeria 5.jpg", "gallery-5.webp"],
  ["_55A1171_(2).jpg", "gallery-6.webp", "multimedia/Fotos XV Pri/Fotos XV Pri"],
  ["_55A1286_(2).jpg", "gallery-7.webp", "multimedia/Fotos XV Pri/Fotos XV Pri"],
  ["_55A1154_(2).jpg", "gallery-hero-main.webp", "multimedia/Fotos XV Pri/Fotos XV Pri"],
  ["_55A1329_(2).jpg", "gallery-hero-secondary.webp", "multimedia/Fotos XV Pri/Fotos XV Pri"],
  ["secundaria.jpg", "secondary.webp"],
  ["Foto con Pascal.jpg", "companion.webp"],
];
const ornaments = [
  ["Flor.png", "flower.webp"],
  ["sol.png", "sun.webp"],
  ["lampara.png", "lantern.webp"],
  ["pascal.png", "chameleon.webp"],
  ["sobre.png", "envelope.webp"],
];
const audio =
  "Enredados - Veo En Ti La Luz (By Danna Paola & Chayanne) (Letra) - Lyrx Music.mp3";
const sources = [
  ...photos.map(([name, , folder = "multimedia/Imágenes"]) => resolve(root, folder, name)),
  ...ornaments.map(([name]) => resolve(root, "recursos", name)),
  resolve(root, "recursos", audio),
];
if (arguments_.length) sources.push(resolve(root, arguments_[1]));
// Validate every input before creating or replacing any production asset.
await Promise.all(
  sources.map(async (source) => {
    if (!(await stat(source)).isFile())
      throw new Error(`No es un archivo: ${source}`);
  }),
);
await Promise.all(
  ["photos", "ornaments", "audio"].map((folder) =>
    mkdir(resolve(destination, folder), { recursive: true }),
  ),
);

const generated = [];
async function optimize(source, output, size, quality, squareBounds = false) {
  const target = resolve(destination, output);
  await sharp(source)
    .rotate()
    .resize({
      width: size,
      ...(squareBounds ? { height: size, fit: "inside" } : {}),
      withoutEnlargement: true,
    })
    .webp({ quality, alphaQuality: 100 })
    .toFile(target);
  generated.push(output);
}
for (const [input, output, folder = "multimedia/Imágenes"] of photos) {
  await optimize(
    resolve(root, folder, input),
    `photos/${output}`,
    1400,
    82,
  );
}
for (const [input, output] of ornaments) {
  await optimize(
    resolve(root, "recursos", input),
    `ornaments/${output}`,
    1000,
    86,
    true,
  );
}
await copyFile(
  resolve(root, "recursos", audio),
  resolve(destination, "audio/theme.mp3"),
);
generated.push("audio/theme.mp3");

const heroTarget = resolve(destination, "photos/hero.svg");
if (arguments_.length) {
  const portrait = await sharp(await readFile(resolve(root, arguments_[1])))
    .rotate()
    .resize(1200, 1600, { fit: "cover", position: "attention" })
    .webp({ quality: 88 })
    .toBuffer();
  await writeFile(
    heroTarget,
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="1600" viewBox="0 0 1200 1600"><image width="1200" height="1600" xlink:href="data:image/webp;base64,${portrait.toString("base64")}"/></svg>\n`,
  );
} else {
  try {
    await stat(heroTarget);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    // Preserve any portrait the owner has already placed at the stable public path.
    await writeFile(
      heroTarget,
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
  <defs>
    <radialGradient id="light" cx="50%" cy="35%" r="80%"><stop stop-color="#b6a0c5"/><stop offset=".55" stop-color="#79648f"/><stop offset="1" stop-color="#33273e"/></radialGradient>
    <radialGradient id="glow"><stop stop-color="#fbe6a8" stop-opacity=".28"/><stop offset="1" stop-color="#fbe6a8" stop-opacity="0"/></radialGradient>
    <pattern id="stars" width="180" height="210" patternUnits="userSpaceOnUse"><circle cx="35" cy="48" r="1.7" fill="#f8e3b5" opacity=".65"/><circle cx="127" cy="153" r="1" fill="#f8e3b5" opacity=".45"/></pattern>
  </defs>
  <path fill="url(#light)" d="M0 0h1200v1600H0z"/><path fill="url(#stars)" d="M0 0h1200v1600H0z"/>
  <ellipse cx="600" cy="590" rx="560" ry="620" fill="url(#glow)"/>
  <path d="M124 1460V610a476 476 0 0 1 952 0v850Z" fill="none" stroke="#e0c593" stroke-opacity=".55" stroke-width="2"/>
  <path d="M146 1438V610a454 454 0 0 1 908 0v828Z" fill="none" stroke="#e0c593" stroke-opacity=".25"/>
  <g transform="translate(600 590)" fill="none" stroke="#f5dc9e" stroke-width="2">
    <circle r="46"/><circle r="62" stroke-opacity=".5"/>
    <path d="M0-120v42M0 78v42M-120 0h42M78 0h42M-85-85l30 30M55 55l30 30M-85 85l30-30M55-55l30-30"/>
    <path d="M-44-106l15 36M29 70l15 36M-106-44l36 15M70 29l36 15M-106 44l36-15M70-29l36-15M-44 106l15-36M29-70l15-36" stroke-opacity=".65"/>
  </g>
  <text x="600" y="850" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="108" fill="#fff4da">Camila</text>
  <text x="600" y="924" text-anchor="middle" font-family="Georgia,serif" font-size="23" letter-spacing="8" fill="#f5dfb9">MIS QUINCE AÑOS</text>
  <path d="M470 990h260" stroke="#e0c593" stroke-opacity=".6"/>
  <text x="600" y="1300" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="25" fill="#f5dfb9" opacity=".8">Un retrato por revelar</text>
</svg>\n`,
      { flag: "wx" },
    );
  }
}
generated.push("photos/hero.svg");

let total = 0;
for (const relative of generated) {
  const { size } = await stat(resolve(destination, relative));
  total += size;
  console.log(`${relative}: ${(size / 1024).toFixed(1)} KiB`);
}
console.log(`Total: ${(total / 1024 / 1024).toFixed(2)} MiB`);
