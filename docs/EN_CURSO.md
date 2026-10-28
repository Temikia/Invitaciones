# Invitación de Camila — trabajo en curso

## Fuente vigente
Documento maestro y paquete de definición leídos. El checklist `Invitacion_Camila_Paquete_Definicion/05_CHECKLIST_PRE_DESARROLLO.md` contiene las respuestas más recientes y prevalece sobre los pendientes anteriores.

## Plan de construcción
- ✅ Fase 1: primera versión Vite + React + TypeScript, 19 escenas, contenido real, assets optimizados, fondos Google, audio voluntario, galería, calendario, cuenta regresiva de Denver y RSVP. Verificada en navegador móvil/escritorio y preparada para desplegar como preview de Vercel. La apertura real de pétalos por capas sigue pendiente de recurso adecuado.
- ❓ Fase 2: conectar módulo independiente de recuerdos con Google Drive, cargas reanudables y política 20 MB/foto, 400 MB/video, 20 archivos/lote, cierre 14 días después y conservación 90 días. Requiere credenciales/carpeta y decisión operativa de limpieza; no simular cargas exitosas.
- ❓ Fase 3: revisión visual con el usuario en Vercel, reemplazo de hero provisional, ajustes y validación de integraciones reales antes de distribuir.

## Decisiones
- Frontend estático Vite/React/TypeScript, animación GSAP/ScrollTrigger y CSS, despliegue en Vercel por el usuario.
- Evento: 22/11/2026, 17:00, America/Denver (UTC−07:00 ese día).
- Confirmación: +1 7202369330, antes del 10/11; sin máximo definido.
- Foto principal `principal.jpg`, derivado en ruta fija `hero.svg` de 1200 × 1600; originales intactos.
- Recuerdos aislados en `/recuerdos`; QR al mismo destino y origen del despliegue. No usar Drive conectado como backend público.
- Fondos mediante Google según solicitud; clave solo en `.env` ignorado por Git.
- Usuario autorizó posteriormente commit y push cuando sea necesario. Despliegue manual en Vercel a cargo del usuario; no se ejecuta desde esta sesión.

## Estado de sesión
Mejora visual (27/10/2026): ✅ hero `principal.jpg`, espacios compactados y atmósfera en todo el recorrido. Partículas atenuadas hasta desaparecer en 2/3; lámparas desde ese punto, con atenuación inversa. Capas por debajo del contenido y centro más discreto. Build, ocho pruebas y navegador móvil/escritorio/movimiento reducido verificados. Commit de esta fase: «Mejora el ritmo visual y la atmósfera de la invitación». Sin push ni despliegue.

Hay cambios simultáneos ajenos en `Celebration.tsx`, `Discovery.tsx`, `useNarrative.ts`, `invitation.ts` y CSS (marcos, fecha, textos y animaciones). Se conservan sin incluirlos en el commit de esta tarea. Siguiente paso: revisar visualmente la combinación y cerrar esos cambios en su sesión; después revisión del usuario sobre preview y conexión real de recuerdos.

Último commit de construcción: `4e4e3f4` — «Construye la primera versión de la invitación de Camila».
Siguiente paso: el usuario despliega preview en Vercel y comparte URL para revisión visual; después se conecta Google Drive. No está lista para distribuir mientras falte almacenamiento real y validación en dominio definitivo.

Verificación: build correcto, ocho pruebas, auditoría sin vulnerabilidades reportadas y pruebas de navegador documentadas en `docs/VERIFICACION.md`. Originales multimedia/recursos permanecen locales y excluidos de Git; no hay cambios ajenos a la tarea identificados.

## Cambio de repositorio
- ✅ Historial y rama `main` trasladados a `https://github.com/CheshireZol/Invitaciones.git`, solicitado por el usuario. Destino comprobado inicialmente sin referencias existentes.
- ✅ `origin` actualizado y primer push completado sin reescribir el historial. El repositorio anterior permanece intacto.
- Commit de documentación del traslado: «Documenta el cambio al repositorio CheshireZol».
- Después del traslado, Vercel debe utilizar el nuevo repositorio; la reconexión del proyecto queda a cargo del usuario junto con el despliegue.

## Galería narrativa — 27/10/2026
- ✅ Portada, carrusel de cinco capítulos y modo cine adaptados de recursos/galeria_camila_carrusel_narrativo.html en la escena 10, con gallery-1 a gallery-5.
- ✅ Secuencia automática cada 3 segundos; sin botón de secuencia ni barra «Cinco instantes, una historia», según petición posterior. Movimiento reducido conserva navegación manual.
- ✅ Build y 16 pruebas; revisión de código y navegador móvil/escritorio, teclado y movimiento reducido. Evidencia en docs/VERIFICACION.md.
- Commit de esta tarea: «Integra la galería narrativa con secuencia automática».
- Cambios previos ajenos en invitation.css (tamaños de retratos) conservados fuera del commit.
- Siguiente paso: revisión visual del usuario; sin push ni despliegue. Continúa pendiente la integración real de recuerdos. Para la siguiente fase, abrir una conversación nueva.

## Tarjeta de confirmaci?n ? 2026-10-27 18:49 (GMT?6)
- ? Escena 16 sustituida por solo la tarjeta de recursos/camila_rsvp_experiencia_premium.html, sin encabezado externo, fotograf?a ni composici?n de la referencia.
- ? Opciones de asistencia, nombre, contador sin m?ximo, nota opcional, pase simb?lico y vista previa antes de abrir WhatsApp. Se conserva el n?mero vigente; confirmar requiere enviar el mensaje.
- ? Build, 16 pruebas y navegador escritorio/m?vil/movimiento reducido; revisi?n independiente sin bloqueantes.
- Commit de la tarea: ?Reemplaza la confirmaci?n por la tarjeta premium?. Sin push ni despliegue.
- Siguiente paso: revisi?n visual del usuario; contin?a pendiente la integraci?n real de recuerdos. Para la siguiente fase, abrir una conversaci?n nueva.
