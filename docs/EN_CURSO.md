# Invitación de Camila — trabajo en curso

## Álbum privado y protecciones — 06/11/2026
- ✅ Fase 1 técnica: álbum local aislado usando controladores reales, secreto temporal y contador simulado. Se rechazaron acceso sin cookie y secreto incorrecto; Drive devolvió listado y rangos de foto y video autenticados. Falta revisión visual y reproducción por la usuaria.
- ✅ Fase 2 local: pruebas automatizadas de lote excesivo, cuota, fallos de servicios, desafío inválido, dominio equivocado y paso válido. Build y 29 pruebas correctos.
- ⏳ Falta configurar y probar Turnstile y Upstash reales, validar álbum y protecciones en Preview, revisar inspección de contenido y vigencia OAuth. El contador local es simulado y no valida servicios externos. Sin publicar ni activar cargas para invitados.
- Último commit previo: `466e0b0`. Siguiente paso: abrir `http://127.0.0.1:5188/album-local` y revisar fotos y video; después configurar servicios reales con la usuaria.

## Interrupción controlada con Drive — 06/11/2026
- ✅ Se generó una imagen PNG válida de 9.7 MB y se usó la lógica real del cliente con Drive. Se simuló un fallo de conexión después del primer bloque (86 %); el reintento consultó la misma sesión, completó al 100 % y la comparación SHA-256 del archivo descargado confirmó contenido idéntico.
- ✅ La prueba creó `prueba-interrupcion-camila.png` en la carpeta de Drive. La interrupción se provocó en la petición del programa; no se desconectó físicamente el navegador.
- ⏳ Pendiente probar desconexión desde navegador, video grande, caducidad de sesión, álbum privado y protecciones reales en Preview. Sin despliegue.

## Recuperación de cargas interrumpidas — 06/11/2026
- ✅ El cliente conserva las sesiones y los archivos terminados en memoria durante la visita. Al reintentar consulta a Drive y continúa desde el último bloque confirmado; no muestra 100 % hasta confirmación real. Cambiar la selección, recargar o cerrar descarta ese estado.
- ✅ Pruebas automatizadas de corte, reanudación y confirmación ya recibida; build y 22 pruebas correctas. En Drive real se subió una parte de `prueba-reanudacion-camila.webp` y se completó el resto con la misma sesión tras consultar el estado; Google expone `Range` para el origen local.
- ⏳ Falta comprobar la desconexión real desde el navegador, video grande, vigencia de sesión, álbum privado y protecciones reales en Preview. No se garantiza reanudación tras recargar ni cerrar la página. Sin despliegue.

## Reproducción de video y revisión de interrupciones — 06/11/2026
- ✅ La usuaria confirmó que el video subido se reproduce en Drive.
- ✅ Corregido para reintentar con las mismas sesiones mientras la página permanezca abierta; pruebas automatizadas y prueba de bloques reales en Drive. Falta probar la desconexión desde navegador.
- ⏳ Después revisar álbum privado, protecciones reales y Preview. Sin despliegue.

## Prueba de varios archivos — 06/11/2026
- ✅ Tras solicitar una prueba con video y varios archivos, la usuaria informó que todo se subió, incluso varios a la vez; posteriormente confirmó la reproducción del video en Drive.
- ⏳ Corregir y probar la recuperación ante una interrupción prolongada. Continúan pendientes el álbum privado, los controles reales contra abuso y la revisión en Preview. Sin despliegue.

## Prueba de foto desde navegador — 06/11/2026
- ✅ La usuaria mostró una foto al 100 % en `/recuerdos` y confirmó que los archivos llegaron a Drive tras la corrección de CORS. No se inspeccionaron sus bytes ni el álbum privado.
- ✅ La usuaria informó después que todo se subió, incluso varios archivos a la vez, y confirmó la reproducción del video. Siguen pendientes reanudación, álbum privado, protecciones reales y revisión en Preview. Sin despliegue.

## Corrección de CORS en cargas — 06/11/2026
- ✅ Se envía a Google el origen validado al crear la sesión reanudable; tanto el servidor local como la API real lo utilizan. Antes Google confirmaba la carga sin autorizar la respuesta al navegador, que mostraba `Failed to fetch`.
- ✅ Comprobado con una imagen real: Google respondió HTTP 200 y devolvió el origen local permitido. Build y 19 pruebas correctos.
- ✅ La usuaria confirmó posteriormente la carga desde navegador y su llegada a Drive. También quedan pendientes Preview, videos, reanudación y controles de protección reales. Sin despliegue.

## Prueba local de fotos — 06/11/2026
- ✅ Servidor de desarrollo aislado en `127.0.0.1:5188`, con la autorización existente de Drive; `npm run dev:recuerdos`. Omite los servicios de protección solo en este servidor local, separado de la API desplegada.
- ✅ Google confirmó HTTP 200 al subir una imagen mínima real mediante una sesión reanudable. Build y 19 pruebas correctos.
- ✅ La usuaria confirmó posteriormente la llegada de una foto subida desde la página. Siguen pendientes la inspección del contenido y las pruebas de álbum, video, reanudación y protecciones reales en Preview. El archivo `prueba-local-camila.png` se creó en Drive como prueba.

## Protección contra abuso y álbum privado — 06/11/2026
- ✅ `/api/drive/session` ahora acepta y valida el lote completo (máximo 20) en servidor antes de crear sesiones. Exige Turnstile validado con acción/hostname en Cloudflare y limita a 4 lotes por IP/minuto con contador compartido Upstash; si la protección falla, no se crean sesiones. Las consultas del álbum también tienen un límite compartido.
- ✅ Implementada la vista `/recuerdos?album=1#<secreto>`. El secreto solo viaja en el fragmento, se canjea por cookie firmada `HttpOnly`/`Secure`/`SameSite=Strict` de 24 horas y se elimina del historial visible. Listado y proxy multimedia requieren cookie, carpeta y marcador propios; el proxy admite `Range` para video.
- ✅ README, decisiones, pasos de Drive y verificación actualizados con las variables y límites. No se leyeron ni generaron secretos; `DRIVE_UPLOADS_ENABLED` continúa apagado y no se desplegó.
- ✅ `npm run build`; `npm test` (19 pruebas). La revisión visual no se pudo completar porque el navegador de control informó que el host no está disponible.
- Commit local de implementación: `5084be4` — «Protege las cargas y añade álbum privado de recuerdos». Sin push ni despliegue.
- ⏳ Pendiente: crear/configurar Turnstile y Upstash en Preview/Production, guardar secretos localmente en Vercel sin compartirlos, validar OAuth renovable, CORS, contenido real, carga/reanudación, Range de video y limpieza en Preview.
- Siguiente paso: configurar Preview y seguir `docs/PASOS_GOOGLE_DRIVE.md`; no habilitar cargas hasta completar la validación controlada y decidir la renovación OAuth.

## Documentación reutilizable de Google Drive — 06/11/2026
- ✅ Creada `docs/GOOGLE_DRIVE_REUTILIZABLE.md`: arquitectura, credenciales, contrato OAuth/Picker, ejecución local, diagnóstico con evidencia, adaptación, renovación y límites de producción. Enlazada desde README y manual; decisiones y verificación actualizadas. Revisados rutas locales y formato del diff.
- Base funcional: autorización y selección real de carpeta completadas, corrección `c1efc0c`, confirmación documentada en `87f8894`.
- Alcance: documentación para reutilizar el método; no se replicaron secretos ni se configuraron otros repositorios.
- Commit de esta fase: «Documenta método reutilizable de Google Drive y Picker»; base funcional `c1efc0c`, confirmación `87f8894`.
- Siguiente paso: abrir una conversación nueva para protección contra abuso y consulta privada; los pendientes de activación siguen descritos abajo.

## Integración real de recuerdos con Google Drive — 06/11/2026
- ✅ Pasos 1 y 2 de `docs/PASOS_GOOGLE_DRIVE.md`: cuenta propietaria, ID de carpeta, Google Drive API y OAuth en modo de pruebas confirmados por la usuaria. Sus respuestas quedaron incorporadas a la guía.
- ✅ Decisiones operativas: cualquiera con el enlace/QR puede subir; los 90 días parten del cierre de cargas del 07/12/2026 a las 00:00 Denver. El borrado inicia el 07/03/2027 a las 00:00 Denver.
- ✅ Permiso propuesto y documentado para revisión: `drive.file`, `openid` y `email`; selección explícita de la carpeta mediante Google Picker para evitar acceso general a Drive.
- ✅ Paso 3 preparado en código: `/api/drive/session` crea sesiones reanudables con credenciales de servidor; el navegador transfiere en bloques y reconsulta el estado si se interrumpe la conexión. `scripts/authorize-drive.mjs` solicita el permiso reducido, valida la cuenta y la carpeta con Picker y guarda el token en `.env` sin imprimirlo. El endpoint permanece apagado si `DRIVE_UPLOADS_ENABLED` no es `true`.
- ✅ `api/drive/cleanup.js` y Cron diario de Vercel programados para borrar permanentemente desde el 07/03/2027 solo archivos marcados por esta app, autenticados con `CRON_SECRET`.
- ✅ Protección contra abuso y consulta web privada implementadas en la fase registrada arriba; la carpeta de Drive no se comparte públicamente.
- ✅ Autorización local completada: la captura de la usuaria confirma carpeta verificada en **Mi unidad** y token guardado en `.env`. La corrección fue enviar `Referrer-Policy: origin` y fijar el origen de Picker; la configuración de Cloud era correcta. Confirmación funcional recibida tras el commit `c1efc0c`. No se leyeron ni imprimieron secretos.
- ⏳ Antes de activar: configurar los servicios de protección en Preview, validar bytes/contenido real y CORS, probar foto/video/reanudación y Range, verificar OAuth y borrado en entorno controlado.
- ✅ Verificación local: `npm run build`, `npm test` (19 pruebas), sintaxis de los módulos Node, `vercel.json` y `git diff --check` correctos. La revisión visual no se realizó porque el navegador de control no estuvo disponible.
- Límite vigente: no activar cargas ni desplegar desde esta sesión. Autorización local y carpeta confirmadas; pendientes configuración de servicios, validación de cargas y vigencia del token OAuth en modo de pruebas antes del evento.
- Commit local: `e42dab9` — «Integra cargas reanudables privadas en recuerdos».
- Siguiente paso: configurar los servicios y variables del servidor y validar foto, video, reanudación, consulta y borrado en Preview cuando se autorice el despliegue. Resolver la caducidad de la autorización OAuth en modo de pruebas antes de activar para invitados.

## Preparación de Google Drive — 06/11/2026 14:35 (GMT−6)
- ✅ Creada `docs/PASOS_GOOGLE_DRIVE.md` con las acciones de la usuaria y las tareas de implementación separadas por fases.
- ✅ Acceso elegido para la galería: privada con enlace secreto.
- ✅ La guía cubre ID y ubicación de carpeta, API y OAuth, resguardo de secretos, variables de Vercel, política de acceso a cargas, retención y revisión en preview.
- ⏳ No se modificó la aplicación ni se leyó/imprimió el contenido de secretos.
- Siguiente paso: recibir el ID y ubicación de `Mis-XV-Camila`, confirmar la cuenta propietaria, habilitar Drive API y definir acceso a cargas y cómputo de los 90 días.
- Commit local: «Documenta los pasos para configurar Google Drive».

## Selector de idioma EN/ES y contenido dinámico — 06/11/2026 14:19 (GMT−6)
- ✅ Añadido el switch **En | Es** con acabado dorado en la cabecera, y en la ruta `/recuerdos`.
- ✅ Traducidos los textos de las 19 escenas, galería, accesibilidad, fecha y horario según `America/Denver`, itinerario, audio, cuenta regresiva, RSVP y recuerdos. La preferencia se guarda localmente; también cambia `html[lang]`, el título y la descripción de la página.
- ✅ Compilación de producción correcta con `npm.cmd run build`.
- Commit local: «Añade selector de idioma inglés y español». Sin push ni despliegue.
- Siguiente paso: revisión visual en móvil/escritorio y confirmar matices de traducción antes de distribuir. No fue posible abrir Chrome en este entorno para la comprobación visual local.

## Inversión exacta de las fotos de la portada de galería — 27/10/2026 22:20 (GMT−6)
- ✅ Invertida la posición de las dos fotos de WhatsApp en la composición de la portada de la galería (`.artwork`, `Gallery.tsx`):
  - Foto de atrás (principal, `gallery-hero-main.webp`, 110.0 KiB): `multimedia/WhatsApp Image 2026-10-27 at 21.26.13.jpeg` (Camila sentada en el jardín con ramo violeta).
  - Foto de adelante (secundaria, `gallery-hero-secondary.webp`, 107.8 KiB): `multimedia/WhatsApp Image 2026-10-27 at 21.25.53.jpeg` (Camila en la escalinata con vestido lavanda).
- ✅ Ajustado `object-position: 50% 50%` para la foto principal y `50% 26%` para la secundaria en `src/styles/gallery.css`.
- ✅ Actualizado el inventario en `docs/ASSETS.md` y `scripts/prepare-assets.mjs`.
- ✅ Build y 19 pruebas de Vitest superados con éxito.
- Commit local: «Invierte las fotos de la portada de galería: jardín atrás y escalinata adelante». Sin push ni despliegue.

## Inversión de fotos en portada de galería — 27/10/2026 22:15 (GMT−6)
- ✅ Invertida la composición de las dos fotografías con Pascal en la portada de galería (`.artwork`, `Gallery.tsx`):
  - Foto principal (atrás, `gallery-hero-main.webp`, 261.2 KiB): `_55A1329_(2).jpg` (Camila de pie con Pascal en el hombro).
  - Foto secundaria (enfrente, `gallery-hero-secondary.webp`, 170.0 KiB): `_55A1154_(2).jpg` (Camila sentada en el pórtico con Pascal).
- ✅ Ajustado el encuadre (`object-position: 50% 22%` para la foto principal y `50% 42%` para la secundaria) en `src/styles/gallery.css`.
- ✅ Actualizado el inventario en `docs/ASSETS.md` y `scripts/prepare-assets.mjs`.
- ✅ Build y 19 pruebas de Vitest superados con éxito.
- Commit local: «Invierte las fotos de la portada de galería: Camila de pie atrás y sentada al frente». Sin push ni despliegue.

## Desvanecido discreto en los extremos del hero — 27/10/2026 21:48 (GMT−6)
- ✅ Aplicado desvanecido vertical discreto y elegante en la parte superior e inferior de la obra del hero (`.magic-hero .art` y `.art-image`):
  - Máscara de degradado lineal vertical (`linear-gradient(to bottom, transparent 0%, ... black 16%, black 84%, ... transparent 100%)`) en `.art` para fundido completo a transparencia en los bordes horizontales.
  - Ajustada la elipse radial de `.art-image` (de 75% a 68% en escritorio y de 81% a 68% en móvil) para evitar cortes abruptos y lograr una fusión orgánica con el fondo oscuro.
  - Añadido velo de degradado suave en `.art::after` con los tonos del fondo (`#160d23`).
- ✅ Build y 19 pruebas de Vitest superados con éxito.
- Commit local: «Añade desvanecido discreto superior e inferior a la imagen del hero». Sin push ni despliegue.

## Intercambio de fotos entre galería y acompañante — 27/10/2026 21:42 (GMT−6)
- ✅ Invertidas de ubicación las fotografías mostradas en las capturas del usuario:
  - `companion.webp` (Escena 12, «Los mejores sueños se viven acompañados»): ahora muestra a Camila junto al caballo blanco (`multimedia/Imágenes/Galería 1.jpeg`).
  - `gallery-1.webp` (Escena 10, Galería Capítulo I «La magia»): ahora muestra a Camila con ramo violeta frente a las columnas (`multimedia/Imágenes/Foto con Pascal.jpg`).
- ✅ Ajustados textos alternativos en `src/config/invitation.ts` y `src/components/scenes/Celebration.tsx`.
- ✅ Regenerados derivados WebP en `public/assets/production/photos/` con `scripts/prepare-assets.mjs` e inventario actualizado en `docs/ASSETS.md`.
- ✅ Build y 19 pruebas de Vitest superados con éxito.
- Commit local: «Intercambia la foto del caballo y la foto de las columnas entre la galería y la escena de compañía». Sin push ni despliegue.

## Actualización de fotos en la portada de galería — 27/10/2026 21:35 (GMT−6)
- ✅ Reemplazadas las fotografías de la composición de la portada de galería (`Gallery.tsx`, acto 1 / preludio del álbum narrativo):
  - Foto principal (`gallery-hero-main.webp`): `multimedia/WhatsApp Image 2026-10-27 at 21.25.53.jpeg` (Camila en escalinata con vestido lavanda).
  - Foto secundaria (`gallery-hero-secondary.webp`): `multimedia/WhatsApp Image 2026-10-27 at 21.26.13.jpeg` (Camila sentada en jardín con ramo violeta).
- ✅ Derivados WebP optimizados en `public/assets/production/photos/` mediante `scripts/prepare-assets.mjs` sin modificar los originales.
- ✅ Actualizado el inventario de recursos en `docs/ASSETS.md`.
- ✅ Build y 19 pruebas de Vitest superados con éxito.
- Commit local: «Actualiza las fotos de la portada de galería con las nuevas imágenes de Camila». Sin push ni despliegue.

## Ajuste y automatización de la portada mágica — 27/10/2026 21:26 (GMT−6)
- ✅ Retirado el movimiento de paralaje del mouse sobre la imagen.
- ✅ Retirados botones y textos secundarios: «Descubre la magia», «Desliza para soñar», «Hay historias que comienzan...», «Camila · Mis XV años» y botón «Toca la luz».
- ✅ Acción de la flor configurada en bucle automático continuo (destellos de partículas y realce luminoso en la flor de la obra).
- ✅ Glow palpitante (`golden-aura` y `art-dust`) activo permanentemente.
- ✅ Cabecera original fija (`InvitationHeader`) restaurada a su comportamiento y apariencia previa.
- ✅ Build y 19 pruebas vitest verificados.
- Commit local: «Ajusta la portada mágica a modo automático y restaura cabecera original». Sin push ni despliegue.

## Hero portada jardín mágico — 27/10/2026 21:20 (GMT−6)
- ✅ Hero integrado desde `recursos/camila_portada_jardin_magico.html` en la escena 1: composición editorial, tipografía, cabecera local C · XV, kicker, título, cita de apertura y botón «Descubre la magia».
- ✅ Fotografía `camila_jardin_encantado.webp` optimizada como derivado de producción en `public/assets/production/photos/camila-jardin-encantado.webp` (101.4 KiB); original en recursos intacto.
- ✅ Glow palpitante (`golden-aura` y `art-dust` con animación `breath`) activado continuamente de fondo.
- ✅ Interacción de la flor («Toca la luz»), destellos de partículas, notificación mágica flotante, lienzo de neblina dorada y navegación fluida a la escena 2 (`#continuar`).
- ✅ Build y 19 pruebas vitest verificados.
- Commit local: «Integra la portada de jardín mágico con glow palpitante». Sin push ni despliegue.

## Foto al compartir el enlace — 27/10/2026 19:39 (GMT−6)
- ✅ Open Graph y tarjeta de imagen grande en el HTML inicial, con título, descripción, fecha y URL pública https://mis-xv-camila.vercel.app/.
- ✅ Derivado share-camila.jpg de la foto principal vigente: 1200 × 630, JPG de 63 130 bytes, retrato completo con laterales difuminados. Script reproducible scripts/prepare-social-image.mjs; originales intactos.
- ✅ Build y 19 pruebas; etiquetas comprobadas en dist/index.html y archivo/dimensiones verificados en dist. Vista revisada visualmente.
- Commit local: «Añade la foto principal a la vista previa al compartir». Sin push ni despliegue. Siguiente paso: publicar cuando el usuario lo autorice y comprobar el enlace compartido en la app de destino; su caché puede conservar una vista previa anterior.

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
