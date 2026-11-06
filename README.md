# Camila · Mis XV años

Invitación narrativa de 19 escenas, mobile-first, construida con React, TypeScript, Vite y GSAP. La información vigente proviene del checklist completado del paquete de definición.

Repositorio vigente: [CheshireZol/Invitaciones](https://github.com/CheshireZol/Invitaciones).

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
- La invitación estática no requiere variables de entorno. El backend de recuerdos sí requiere las variables de servidor descritas en la guía de Drive. Las claves de generación de fondos se usan solo localmente; los secretos de servidor nunca deben llevar prefijo `VITE_` ni incluirse en el frontend.
- `/recuerdos` tiene rewrite a la aplicación. QR y botón usan el mismo origen del despliegue.
- `noindex` evita indexación solicitada a buscadores; no representa control de acceso. El álbum no tiene galería pública.

El usuario administra el despliegue. Esta entrega es para revisión visual, aún no para distribuir a invitados: la integración real de recuerdos pertenece a la siguiente fase.

## Cambios de contenido y fotos

La invitación está disponible en español e inglés con el selector **En | Es** de la cabecera. La preferencia se conserva en este dispositivo y también se aplica a la página de recuerdos (`/recuerdos`), las etiquetas accesibles y los metadatos de la página.

Todos los datos, mensajes, horarios y rutas viven en `src/config/invitation.ts`. La fecha tiene offset explícito y zona `America/Denver`, sin depender de la zona del navegador.

La vista previa al compartir el enlace usa Open Graph en `index.html` y `public/assets/production/photos/share-camila.jpg`. Si cambia el hero, regenerar con `node scripts/prepare-social-image.mjs` y publicar ambos cambios. Si cambia el dominio público, actualizar las URLs absolutas del HTML. La vista previa final depende de la app donde se comparta y de su caché.

La foto principal usa `multimedia/Imágenes/principal.jpg`, optimizada en la ruta fija `public/assets/production/photos/hero.svg`, proporción 3:4, 1200 × 1600. [Mapa de recursos y sustitución](docs/ASSETS.md). Los fondos fueron generados con la API de Google: [procedencia y prompts](docs/FONDOS.md).

La música solo se solicita después de pulsar reproducir. Su botón se vuelve flotante abajo a la derecha cuando el control original sale por arriba, conserva la misma reproducción y vuelve a su lugar al regresar; el flotante desaparece al llegar al lago. La cabecera C · XV permanece fija y adquiere un cristal casi transparente al desplazarse. Las fotos posteriores cargan de forma diferida. Por decisión del usuario, la experiencia queda fija en Completo, sin selector de ambiente ni pausa/reanudación visible de galería; la secuencia se pausa al navegar con teclado, quedar fuera de pantalla o cambiar de pestaña. La flor suministrada es una imagen plana: la primera versión anima iluminación y escala; la apertura real de pétalos requiere un recurso separado por capas.

## Recuerdos: siguiente fase

Documentación de Drive: [pasos y estado del evento](docs/PASOS_GOOGLE_DRIVE.md) · [método reutilizable, diagnóstico y adaptación a otros proyectos](docs/GOOGLE_DRIVE_REUTILIZABLE.md). La autorización local de la carpeta ya quedó completada; las cargas para invitados todavía requieren las validaciones indicadas abajo.

La ruta `/recuerdos` muestra la carga solo cuando el backend confirma que está configurado y habilitado; una preview incompleta mantiene oculta la selección. El servidor valida nombre, extensión, MIME declarado y tamaño, e inicia una sesión reanudable de Drive; el navegador transfiere bloques directamente y muestra progreso real. Como el backend no recibe los bytes, la inspección del contenido real y las pruebas CORS en teléfono siguen pendientes antes de activar. No informa éxito hasta que Google Drive completa la carga. La vista web de consulta por enlace secreto aún no está implementada; la carpeta de Drive permanece privada.

Funciones de Vercel crean sesiones de carga reanudable; el navegador envía los archivos directamente a Google Drive para evitar pasar videos de 400 MB por el body de una función. Antes de activar se requieren protección contra abuso y pruebas en la preview. El secreto OAuth y el refresh token no llegan al cliente de invitados. El sistema no usa el conector personal de Drive como backend de invitados.

El permiso previsto es `drive.file` más `openid` y `email`, con selección explícita de la carpeta mediante Google Picker. `npm run drive:authorize` ejecuta la autorización local, valida el acceso de borrado y guarda el token en `.env` sin imprimirlo. La carpeta sigue privada. En modo de pruebas, el token Drive puede caducar a los siete días. La limpieza diaria de Vercel empieza el 7 de marzo de 2027 a las 00:00 de Denver (programada a las 07:00 UTC) y elimina solo archivos marcados por la app. Las cargas siguen desactivadas hasta configurar la autorización en Vercel y completar protección contra abuso y pruebas.

Política elegida del checklist: 20 MB/foto, 400 MB/video, 20 archivos por lote, múltiples lotes, cierre al terminar el 6 de diciembre de 2026 (hora Denver), conservación 90 días desde el cierre del 7 de diciembre a las 00:00 Denver. La usuaria eligió acceso de carga para cualquiera con el enlace/QR. La limpieza programada empezará el 7 de marzo de 2027 y solo afectará archivos creados por la app. El texto “sin límite” de otra sección se interpreta como número de lotes sujeto al espacio disponible, conservando los límites concretos por archivo.

Para retomar: [estado y siguientes fases](docs/EN_CURSO.md).
