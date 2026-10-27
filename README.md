# Camila · Mis XV años

Invitación narrativa de 19 escenas, mobile-first, construida con React, TypeScript, Vite y GSAP. La información vigente proviene del checklist completado del paquete de definición.

## Desarrollo

Requiere Node.js 24 LTS (o versión compatible con Vite 8).

```sh
npm ci
npm run dev
npm run build
npm test
```

El proyecto incluye los recursos de producción necesarios para compilar. Los originales locales de `multimedia/` y `recursos/` se conservan intactos y no se suben a Git.

## Revisión en Vercel

- Framework: **Vite**.
- Directorio raíz: raíz de este repositorio.
- Instalación: `npm ci`.
- Build: `npm run build`.
- Output: `dist`.
- Node.js: **24.x**.
- No se requieren variables de entorno para esta primera versión. La clave Google se usa solo localmente para generar fondos; nunca debe llevar prefijo `VITE_` ni incluirse en el frontend.
- `/recuerdos` tiene rewrite a la aplicación. QR y botón usan el mismo origen del despliegue.
- `noindex` evita indexación solicitada a buscadores; no representa control de acceso. El álbum no tiene galería pública.

El usuario administra el despliegue. Esta entrega es para revisión visual, aún no para distribuir a invitados: la integración real de recuerdos pertenece a la siguiente fase.

## Cambios de contenido y fotos

Todos los datos, mensajes, horarios y rutas viven en `src/config/invitation.ts`. La fecha tiene offset explícito y zona `America/Denver`, sin depender de la zona del navegador.

La foto principal es provisional, a petición del usuario. Ruta fija: `public/assets/production/photos/hero.svg`, proporción 3:4, 1200 × 1600. [Mapa de recursos y sustitución](docs/ASSETS.md). Los fondos fueron generados con la API de Google: [procedencia y prompts](docs/FONDOS.md).

La música solo se solicita después de pulsar reproducir. Las fotos posteriores cargan de forma diferida y las animaciones respetan movimiento reducido. La flor suministrada es una imagen plana: la primera versión anima iluminación y escala; la apertura real de pétalos requiere un recurso separado por capas.

## Recuerdos: siguiente fase

La ruta independiente permite seleccionar y validar archivos, e informa que aún no se envían. No simula progreso ni almacenamiento exitoso. Para habilitarla se necesita una carpeta privada de Google Drive, credenciales del backend y pruebas en móvil del transporte de videos grandes.

Arquitectura propuesta: funciones de Vercel crean sesiones de carga reanudable; el navegador envía los archivos directamente a Google Drive para evitar pasar videos de 400 MB por el body de una función. Deben verificarse CORS, restricciones del destino, cuota, validación del servidor y protección contra abuso antes de activar. Las credenciales no deben llegar al cliente. El sistema no usará el conector personal de Drive como backend de invitados.

Política elegida del checklist: 20 MB/foto, 400 MB/video, 20 archivos por lote, múltiples lotes, cierre al terminar el 6 de diciembre de 2026 (hora Denver), conservación 90 días. El borrado requiere un proceso programado explícito; aún no está implementado. El texto “sin límite” de otra sección se interpreta como número de lotes sujeto al espacio disponible, conservando los límites concretos por archivo.

Para retomar: [estado y siguientes fases](docs/EN_CURSO.md).
