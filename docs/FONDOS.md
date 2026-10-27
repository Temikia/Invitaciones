# Fondos originales de Camila

Fecha de preparación: 27 de octubre de 2026 (Ciudad de México).

Proveedor solicitado: Google Gemini API, mediante `x-goog-api-key`. Modelo: `gemini-2.5-flash-image`, confirmado en la consulta de modelos disponibles para la clave local. No se utiliza otro proveedor ni un cambio automático de modelo.

La implementación sigue la [documentación oficial de generación de imágenes de Google](https://ai.google.dev/gemini-api/docs/generate-content/image-generation): `generateContent`, respuesta de imagen y proporción `9:16`. Google incorpora SynthID en sus imágenes generadas.

## Reproducción

Requiere Node.js con `process.loadEnvFile`, dependencias del proyecto instaladas y una clave en `.env`: `AISTUDIO_GEMINI_API_KEY`, `GEMINI_API` o `GEMINI_API_KEY`. El script no imprime claves ni respuestas completas de Google.

```sh
node scripts/generate-backgrounds.mjs --list-models
node scripts/generate-backgrounds.mjs
```

Los archivos existentes se conservan. Para regenerar deliberadamente, usar `--overwrite`. `GEMINI_IMAGE_MODEL` permite seleccionar explícitamente otro modelo disponible, sin sustitución automática.

## Dirección artística y prompts

Los prompts completos y reproducibles están en `scripts/generate-backgrounds.mjs`, objeto `prompts`.

- **forest**: bosque nocturno pintado, árboles antiguos laterales, violeta profundo y sombras ciruela, luciérnagas doradas sutiles, centro y tercio superior oscuros para componer la flor y el nombre en la interfaz. Fantasía romántica madura, sin personajes ni texto.
- **lake**: lago tranquilo al anochecer, cielo violeta oscuro con espacio para el nombre, pueblo y palacio originales apenas visibles en una orilla distante y baja, ventanas doradas con reflejos suaves en el agua. Sin personajes, barcos ni texto.

Son escenarios originales de cuento romántico, sin replicar fotogramas. Se solicita encuadre vertical 9:16; la conversión final produce WebP de 1080 × 1920, calidad 88.

## Archivos esperados

- `public/assets/production/backgrounds/forest.webp`
- `public/assets/production/backgrounds/lake.webp`

Estado: ambos fondos generados mediante Google Gemini y revisados visualmente el 27 de octubre de 2026. Bosque: 1080 × 1920, 86 KiB. Lago: 1080 × 1920, 96 KiB. Se confirmó la ausencia de personajes, texto y logos visibles, la paleta violeta/dorado y el espacio oscuro para la composición de la invitación.
