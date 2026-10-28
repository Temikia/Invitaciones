# Invitación de Camila — trabajo en curso

## Cabecera y controles definitivos — 27/10/2026 19:22 (GMT−6)
- ✅ Experiencia fija en Completo. Se retiraron selector, almacenamiento de preferencias y modos alternativos; las preferencias antiguas no afectan a la página. Sin botón de pausa/reanudación de galería, con pausa automática por teclado/pestaña/visibilidad.
- ✅ C · XV convertido en header semántico fijo, 44 px más safe-area, transparente al inicio y cristal casi transparente al desplazarse.
- ✅ Música flotante en círculo de 60 px abajo a la derecha cuando el control sale por arriba; vuelve inline al regresar. Mismo audio, reproducción y foco conservados; flotante oculto desde la entrada al lago.
- ✅ Build, 19 pruebas, revisión independiente y navegador de producción local móvil/escritorio. Completo con SO reducido y antigua preferencia paused; audio real continúa de 1.05 a 3.07 s sin remontarse; regreso, pausa y saltos inicio/retrato/lago/música comprobados. Se eliminaron tres pruebas correspondientes al selector retirado.
- Commit local: «Fija los efectos completos y añade cabecera glass y audio flotante». Sin push ni despliegue. Siguiente paso: revisión del usuario y publicación cuando la autorice; continúa pendiente la integración real de recuerdos. Para otra fase, abrir conversación nueva.

## Efectos sin cambiar ajustes del teléfono — 27/10/2026 19:04 (GMT−6)
- ✅ Sustituida la desactivación total por un ambiente suave con luz y desvanecimientos cuando el dispositivo pide reducir movimiento. Sin desplazamientos, paralaje ni zoom en ese modo.
- ✅ Selector Completo/Suave/Sin efectos junto a la música; elección persistente y prioritaria sobre el sistema. Funciona aunque no se permita almacenamiento. Ningún control después del lago.
- ✅ GSAP y CSS coordinados por `data-motion`; galería cada 3 s en Completo, 6 s con fundidos en Suave, manual en Sin efectos. Pausa propia de galería y pausa al usar teclado, salir de pantalla o cambiar de pestaña.
- ✅ Build y 22 pruebas; revisión independiente y build de producción local revisado en móvil/escritorio. Con SO reducido se midieron pulsos suaves; Completo vuelve a activar los efectos, persiste tras recarga y Sin efectos deja cero animaciones y ningún contenido oculto. Pausa de galería comprobada.
- Commit local: «Mantiene efectos visuales sin cambiar los ajustes del teléfono». Sin push ni despliegue. Siguiente paso: publicar cuando el usuario lo autorice y comprobar en su Android físico. Para la siguiente fase, abrir conversación nueva.
- Esta decisión sustituye la recomendación anterior de cambiar los ajustes de Android. No requiere cambiar Vite ni rehacer la aplicación.

## Galería ampliada y diagnóstico Android — 27/10/2026 18:58 (GMT−6)
- ✅ Se agregaron `_55A1171_(2).jpg` y `_55A1286_(2).jpg` como capítulos VI y VII, después de las cinco fotografías anteriores. Derivados WebP de producción; originales intactos.
- ✅ Contador y baraja circular adaptados a siete fotos; tres tarjetas principales accesibles por teclado. Build, 19 pruebas y navegador móvil/escritorio comprobados; revisión independiente sin hallazgos.
- ✅ En `https://mis-xv-camila.vercel.app/`: movimiento normal produce 52 animaciones CSS y partículas en movimiento; al emular movimiento reducido hay cero animaciones CSS. Vite entrega los efectos correctamente. La preferencia efectiva del teléfono Android/Chrome todavía requiere comprobación del usuario.
- Commit local: «Amplía la galería a siete fotografías y documenta las animaciones». Sin push ni despliegue.
- Siguiente paso: revisar en Android «Quitar animaciones»/«Reducir movimiento» y recargar. Si está desactivado y continúa estático, revisar preferencia efectiva y consola en ese teléfono. Sigue pendiente integrar recuerdos. Para la siguiente fase, abrir conversación nueva.

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
