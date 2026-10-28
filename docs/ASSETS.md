# Recursos de producción

Los archivos originales permanecen en `multimedia/Imágenes` y `recursos`. Los derivados se guardan en `public/assets/production`; sus URLs comienzan en `/assets/production`. No se modifica ningún original.

Para preparar los recursos, con las dependencias instaladas:

```sh
node scripts/prepare-assets.mjs
```

El script necesita `sharp`, corrige la orientación EXIF y elimina metadatos de las imágenes derivadas. Las fotografías WebP usan calidad 82 y ancho máximo de 1400 px sin ampliación. Los ornamentos usan calidad 86, máximo 1000 × 1000 px y conservan el canal alfa cuando existe. El audio se copia sin recodificar. La salida informa los tamaños individuales y el total.

| Original | URL pública |
| --- | --- |
| `multimedia/Fotos XV Pri/Fotos XV Pri/_55A1378_(2).jpg` (WebP incrustado en SVG) | `/assets/production/photos/hero.svg` |
| `recursos/camila_jardin_encantado.webp` | `/assets/production/photos/camila-jardin-encantado.webp` |
| Derivado de la foto incrustada en `hero.svg`, con laterales difuminados | `/assets/production/photos/share-camila.jpg` |
| `multimedia/Imágenes/Foto con Pascal.jpg` | `/assets/production/photos/gallery-1.webp` |
| `multimedia/Imágenes/Galeria 2.jpg` | `/assets/production/photos/gallery-2.webp` |
| `multimedia/Imágenes/galeria 3.jpg` | `/assets/production/photos/gallery-3.webp` |
| `multimedia/Fotos XV Pri/Fotos XV Pri/_55A1398_(2).jpg` | `/assets/production/photos/gallery-4.webp` |
| `multimedia/Imágenes/galeria 5.jpg` | `/assets/production/photos/gallery-5.webp` |
| `multimedia/Fotos XV Pri/Fotos XV Pri/_55A1171_(2).jpg` | `/assets/production/photos/gallery-6.webp` |
| `multimedia/Fotos XV Pri/Fotos XV Pri/_55A1286_(2).jpg` | `/assets/production/photos/gallery-7.webp` |
| `multimedia/Fotos XV Pri/Fotos XV Pri/_55A1329_(2).jpg` | `/assets/production/photos/gallery-hero-main.webp` |
| `multimedia/Fotos XV Pri/Fotos XV Pri/_55A1154_(2).jpg` | `/assets/production/photos/gallery-hero-secondary.webp` |
| `multimedia/Imágenes/secundaria.jpg` | `/assets/production/photos/secondary.webp` |
| `multimedia/Imágenes/Galería 1.jpeg` | `/assets/production/photos/companion.webp` |
| `recursos/Flor.png` | `/assets/production/ornaments/flower.webp` |
| `recursos/sol.png` | `/assets/production/ornaments/sun.webp` |
| `recursos/lampara.png` | `/assets/production/ornaments/lantern.webp` |
| `recursos/pascal.png` | `/assets/production/ornaments/chameleon.webp` |
| `recursos/sobre.png` | `/assets/production/ornaments/envelope.webp` |
| MP3 de «Veo En Ti La Luz» en `recursos` | `/assets/production/audio/theme.mp3` |

## Cambiar la fotografía principal

El contrato es siempre `public/assets/production/photos/hero.svg`, con dimensiones **1200 × 1600 px** y proporción **3:4**. Contiene la fotografía `_55A1378_(2).jpg` elegida por el usuario (257.1 KiB). El original permanece intacto; el script conserva este derivado al ejecutarse sin `--hero`.

Para probar cualquier retrato sin cambiar componentes ni rutas:

```sh
node scripts/prepare-assets.mjs --hero "multimedia/Imágenes/principal.jpg"
```

El script recorta el retrato a 3:4 y lo incrusta en un SVG autónomo en la misma ruta. Revisar visualmente el encuadre después de cada reemplazo. También se puede colocar manualmente otro SVG de 1200 × 1600 px en esa ubicación. Las ejecuciones sin `--hero` conservan el archivo existente. Para recuperar el placeholder, eliminar únicamente el derivado `hero.svg` y ejecutar el script sin opciones.

## Validación inicial

Vista previa social: `node scripts/prepare-social-image.mjs` regenera `share-camila.jpg` desde el hero vigente, sin modificar originales. JPG de 1200 × 630, 63 130 bytes en la generación del 27/10/2026. Volver a ejecutarlo después de sustituir la foto principal. Las URLs absolutas de Open Graph/Twitter en `index.html` apuntan al dominio público actual y deben actualizarse si cambia.

Ampliación del 27/10/2026: siete fotos de galería. Las dos nuevas proceden de Fotos XV Pri: WebP calidad 82, orientación corregida, sin metadatos y 1400 × 2099 px; tamaños 267.9 KiB y 320.5 KiB. El script incluye sus rutas para reproducir los derivados; originales intactos.

Producción preparada el 27 de octubre de 2026: **14 archivos, 11.41 MiB** en total; el MP3 ocupa 9870.4 KiB y las imágenes/SVG aproximadamente 1.77 MiB. Las dimensiones se verificaron con `sharp`. Flor, sol, lámpara y sobre conservan transparencia; el original `pascal.png` es opaco y su derivado también.

Una segunda ejecución confirmó mediante SHA256 que los 15 archivos originales de las carpetas de entrada permanecen intactos y que el hero existente se conserva byte por byte. También se probó `--hero` con una fotografía real, se verificó el WebP incrustado de 1200 × 1600 px y se restauró el placeholder original.
