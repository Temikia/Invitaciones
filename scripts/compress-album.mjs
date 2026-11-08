// Comprime fotos del álbum y, con --upload, reemplaza el contenido de los recuerdos homónimos en Drive.
// Uso: node --env-file=.env scripts/compress-album.mjs <carpeta-originales> <carpeta-salida> [--upload]
// Nunca modifica los originales. En Drive conserva ID, nombre, fecha de creación y marcador de la app.
import { readdir, mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getDriveAccessToken } from "../server/drive.js";

const MAX_SIDE = 4096; // mayor que cualquier pantalla 4K en vertical
const QUALITY = 88; // mozjpeg 4:4:4: sin diferencia visible frente al original reducido

const [sourceDir, outputDir] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const upload = process.argv.includes("--upload");
if (!sourceDir || !outputDir) {
  console.error("Uso: node --env-file=.env scripts/compress-album.mjs <originales> <salida> [--upload]");
  process.exit(1);
}

await mkdir(outputDir, { recursive: true });
const names = (await readdir(sourceDir)).filter((name) => /\.jpe?g$/iu.test(name)).sort();
let before = 0;
let after = 0;
for (const name of names) {
  const input = path.join(sourceDir, name);
  const output = path.join(outputDir, name);
  const info = await sharp(input, { failOn: "none" })
    .rotate()
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
    .keepIccProfile()
    .jpeg({ quality: QUALITY, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(output);
  const original = (await stat(input)).size;
  before += original;
  after += info.size;
  console.log(`${name}: ${(original / 1e6).toFixed(1)} MB → ${(info.size / 1e6).toFixed(2)} MB (${info.width}×${info.height})`);
}
console.log(`Total: ${(before / 1e6).toFixed(0)} MB → ${(after / 1e6).toFixed(1)} MB en ${names.length} fotos.`);

if (upload) {
  const folder = process.env.DRIVE_FOLDER_ID;
  if (!folder) throw new Error("DRIVE_FOLDER_ID no está configurado.");
  const token = await getDriveAccessToken();
  const params = new URLSearchParams({
    q: `'${folder}' in parents and trashed = false and appProperties has { key='camilaMemoryUpload' and value='true' }`,
    corpora: "allDrives",
    includeItemsFromAllDrives: "true",
    supportsAllDrives: "true",
    pageSize: "1000",
    fields: "files(id,name,mimeType)",
  });
  const listing = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!listing.ok) throw new Error(`Listado de Drive falló (${listing.status}).`);
  const byName = new Map();
  for (const file of (await listing.json()).files ?? []) {
    if (file.mimeType !== "image/jpeg") continue;
    if (byName.has(file.name)) throw new Error(`Nombre repetido en Drive: ${file.name}`);
    byName.set(file.name, file.id);
  }
  for (const name of names) {
    const id = byName.get(name);
    if (!id) { console.warn(`Sin recuerdo homónimo en Drive: ${name}`); continue; }
    const body = await readFile(path.join(outputDir, name));
    const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=media&supportsAllDrives=true&fields=id,size`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "image/jpeg" },
      body,
    });
    if (!response.ok) throw new Error(`No se reemplazó ${name} (${response.status}).`);
    const updated = await response.json();
    if (Number(updated.size) !== body.length) throw new Error(`Tamaño inesperado en Drive para ${name}.`);
    console.log(`Reemplazado en Drive: ${name}`);
  }
}
