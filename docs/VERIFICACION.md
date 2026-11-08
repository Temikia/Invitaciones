# Verificación de la primera versión

## Película reconstruida sin congelamientos — 08/11/2026
- Build y 58 pruebas (11 nuevas en `src/lib/albumMovie.test.ts`, incluida la regresión: precargar la foto siguiente no le quita el estado listo a la actual).
- Navegador local con las 35 fotos reales, muestreo cada 200–250 ms. Código anterior: la foto 2 y la 4 quedaron en pausa con la capa nueva transparente y la anterior visible, y saltaron a los 15 s (límite de espera); la 3 y la 5 pasaron bien. Código nuevo: ocho fotos seguidas (4 → 11) a 5 s exactos, sin pausas y con fundido completo en cada paso; salto doble con flechas en mitad de un fundido, retroceso, pausa y reanudación con espacio, cierre y reapertura desde la foto 1 sin restos de la sesión anterior.
- No observado: el retiro de la capa anterior con el fin real del fundido en movimiento continuo (el panel del navegador alternaba a oculto; con el fundido ya terminado la capa sí se había retirado), teléfono real, videos reales y movimiento reducido.

## Controles del visor y transición de la película — 07/11/2026
- Build y 47 pruebas (nuevas en `src/lib/albumZoom.test.ts`: zoom mínimo 100 %, límites de arrastre con y sin giro, umbral de deslizar).
- Visor en navegador local con fotos reales: dos «Acercar» → 200 % y arrastre con ratón limitado al borde (foto vertical: sin desplazamiento horizontal, vertical hasta −128 px); alejar hasta 100 % recentra; giro de 90° cabe completo en 977 × 684; doble clic → 200 % en el punto; rueda acerca y aleja. Al pasar al siguiente, la capa saliente quedó debajo y la nueva apareció con fundido. Deslizar simulado con puntero táctil: izquierda 2 → 3, derecha 3 → 2, gesto corto sin cambio y la foto vuelve a su lugar. En 375 × 812, iconos sueltos sin círculo.
- Película: al avanzar, la capa precargada pasó a ser la actual ya lista en el mismo render (sin esperar carga) y se montó la siguiente. Con `(hover: none)` la X no se oculta; con ratón la regla de ocultar se aplica tras 2.5 s.
- No observado: fundidos en movimiento y ocultamiento animado de la X (el panel del navegador estaba oculto y no corre animaciones), pellizcar con dos dedos reales, teléfono real y movimiento reducido.

## Cuenta regresiva en recuerdos, botón por fecha y ornamentos — 07/11/2026
- Build y 41 pruebas (3 nuevas: etapas de carga con sus bordes exactos, ventana del botón del álbum y fechas inválidas).
- Navegador local: `/recuerdos` hoy muestra sol, cuenta regresiva (14 d 19 h 45 min, coherente con 04:14 UTC) y aviso, sin selector ni Turnstile; con `Date.now` fijado a 22/11 17:00:01 Denver apareció el selector y desapareció el temporizador en 1 s. En `/album` el botón no está hoy y apareció tras fijar 21/11 17:00:05 y esperar el ciclo de 30 s.
- 26 partículas y 6 linternas por página (opacidad de linternas 0.7), repartidas en altura; contenido por encima de la capa. 375 px sin desbordamiento horizontal. Movimiento reducido no emulado. Sin despliegue.

## Fundido constante, X visible y portada sin pausa por cursor — 07/11/2026
- Build y 38 pruebas. Película en navegador local: en cuatro avances seguidos (fotos listas a los 161–1441 ms, una ya en caché) la capa nueva tuvo la animación `album-movie-fade-in` en curso y la anterior debajo. Antes, una foto precargada podía cargar antes del primer pintado y la transición no se disparaba.
- La X tiene opacidad 1, nada la tapa y se ve sin pasar el cursor en el panel; no se pudo reproducir el fallo de la usuaria ni probar pantalla completa (el panel no la permite). Se le dio capa propia y más contraste.
- La portada ya no escucha cursor ni foco; no se observó en movimiento porque el panel reporta la pestaña oculta (pausa legítima). Sin despliegue.

## Marco fijo en la película y navegación por la cabecera — 07/11/2026
- Build y 38 pruebas. Película en navegador local: foto 1281 × 1920 en un marco de 421 × 630 px centrado en 736 × 630, igual 1.5 s después, con la animación de zoom aplicada a la imagen dentro del marco (`overflow: hidden`). El zoom en curso no se vio porque el panel reportaba la pestaña oculta y la película estaba en pausa.
- «C · XV» es un enlace a `/` de 88 × 44 px con etiqueta «Ir a la invitación» y conserva su aspecto. `/album` y `/recuerdos` ya no tienen enlaces «Volver…». Sin emular movimiento reducido ni probar en teléfono real.

## Película con fondo desenfocado y carga de 20 en 20 — 07/11/2026
- Build y 38 pruebas (incluye `movieMotion`: recuerdos seguidos nunca repiten movimiento y alternan acercar/alejar; tandas de 20 con 45 archivos).
- Navegador local con las 35 fotos reales: el mosaico abrió con 20 cuadros y 20 miniaturas pedidas; «Ver más» (etiqueta accesible «quedan 15») mostró las 35, desapareció y llevó el foco al cuadro 21. «Subir mis fotos» enlaza a `/recuerdos` y aparece también mientras carga el álbum.
- Película en escritorio: foto vertical 1281 × 1920 completa con bandas desenfocadas a los lados; en 375 × 812, bandas arriba y abajo. Al avanzar, la capa anterior siguió al 100 % debajo mientras la nueva cargaba transparente; al cargar, la nueva pasó encima y la anterior se retiró al terminar el fundido. El panel del navegador reportaba la pestaña como oculta, así que la película estaba en pausa y no se pudo observar el fundido en movimiento ni el zoom en curso.
- Sin emular movimiento reducido, sin teléfono real y sin videos reales. Sin despliegue.

## Miniaturas del álbum — 07/11/2026
- Build y 37 pruebas (incluye `thumbSrc`). Servidor local con Drive real: `thumb` 480/960/1920 → 200 `image/jpeg` de 41/99/305 KB con `Cache-Control: private, max-age=86400`; tamaño 700 → 400; id ajeno → 404. Las 35 fotos respondieron; las 3 sin miniatura de Drive (50–51 MB) se redujeron con `sharp` en unos 3 s.
- Navegador: el mosaico cargó solo miniaturas (ningún original) y el visor mostró la versión de 1281 × 1920. No se probaron videos reales, HEIC ni Preview.

## Álbum sin enlace privado — 07/11/2026
- Build y 36 pruebas. Servidor local `dev:seguridad`: `GET /api/drive/gallery/index` sin cookie → 200 con 35 fotos; `media` con `Range` → 206 `image/jpeg`; `POST /api/drive/gallery/access` → 404; `/album-local` → 302 a `/album`. En navegador `/album` mostró «35 fotos · 0 videos» sin enlace secreto.
- Las primeras fotos tardaron por su tamaño (43–50 MB cada original). No se probó en Preview.

## Quitar archivos antes de subir — 07/11/2026
- Build y 36 pruebas. En navegador local se seleccionaron tres fotos y un `.txt`; al quitar el `.txt` desapareció el aviso de formato, el foco pasó al botón vecino y al quitar todo volvió al selector. No se probó en teléfono real ni con lector de pantalla.

## Rediseño visual del álbum — 07/11/2026
- Build y 36 pruebas correctos (orden aleatorio, filtros, patrón del mosaico y carga progresiva de 101 archivos).
- Navegador local con datos simulados (62 archivos con fotos de la invitación y un video local de 10 s, sin tocar Drive): portada animada en escritorio y 375 px sin desplazamiento horizontal; mosaico de 4 y 3 columnas, filtros, conteo, «Ver más (12)» y barra fija; visor con flechas de teclado (2 → 4 de 50) y Esc; modo película a pantalla completa, avance entre fotos, video sin sonido cortado a los 5 s y cierre con Esc devolviendo el foco.
- No verificado: movimiento reducido emulado (solo revisión de CSS y lógica), deslizar con el dedo en un teléfono real, pantalla completa en iOS y el álbum con archivos reales: la carpeta de Drive no tiene archivos visibles para la app (0 con permiso `drive.file`).

## Visor y pasarela del álbum — 07/11/2026
- Build y 33 pruebas correctos; la prueba de paginación cubre 101 archivos. En navegador local se verificaron cuadrícula en escritorio y móvil, apertura de foto, zoom, giro, Escape y apertura del visor de video.
- No se emularon preferencias de movimiento reducido ni se probó visualmente una segunda página o reproducción del video. Revisar consumo de imágenes originales, cuota de lecturas y Preview.

## Cámara en la cabecera — 07/11/2026
- Build y 31 pruebas correctos. El navegador no abrió; pendiente revisar escritorio, móvil, movimiento reducido y navegación por teclado visualmente.

## Página privada del álbum — 07/11/2026

- Build y 31 pruebas correctos. En navegador, `/recuerdos` enlaza a `/album`; sin sesión pide el enlace privado, con el enlace local se muestran fotos y video y el botón funciona con la sesión existente. El formato anterior se redirige y un secreto inválido se rechaza; el fragmento se elimina de la barra.
- Revisión visual de escritorio y móvil. No se emuló movimiento reducido ni se revisó todavía el rewrite de Vercel desplegado. La ruta nueva no abre el álbum sin autorización.

## Velo de progreso — 07/11/2026

- Build y 31 pruebas correctas. Las pruebas cubren el avance de datos enviados, 100 % solo tras confirmación y el retroceso al último bloque confirmado ante una desconexión.
- Se revisaron visualmente miniaturas al 0 % y 100 % en escritorio y al 0 % en móvil, y se cargó una foto real desde el navegador usando Cloudflare, Upstash y Drive. No se observó visualmente el estado intermedio; la transición está limitada por CSS a `prefers-reduced-motion: no-preference`, sin emulación de movimiento reducido.

## Miniaturas de selección — 07/11/2026

- Build y 29 pruebas correctos. Cuatro imágenes seleccionadas se revisaron visualmente en escritorio y a 390 × 844; el progreso y las etiquetas accesibles permanecen en la lista.
- No se revisaron visualmente un video, formatos incompatibles ni movimiento reducido en navegador. El nuevo diseño no incorpora animaciones; las URL temporales se liberan al cambiar de archivo o desmontar el componente.

## Carga protegida desde navegador local — 07/11/2026

- En `dev:seguridad`, el widget Turnstile real completó su verificación y la API real aceptó el token, acción y dominio junto con la cuota de Upstash. Una imagen `gallery-7.webp` se cargó desde navegador hasta 100 %, con confirmación de Drive.
- Una solicitud de otro origen y otra con token inválido fueron rechazadas con HTTP 403. La prueba usa un widget específico de localhost y no acredita el dominio público ni su configuración en Vercel.

## Preparación de prueba local de protecciones — 07/11/2026

- Se creó un widget real de Turnstile separado para `127.0.0.1`, pendiente de guardar sus claves locales. `npm run dev:seguridad` usa la API real y Upstash desde un servidor solo local. Sin las claves locales, el proceso se detiene antes de abrir el servidor.
- Build y 29 pruebas correctos. No se ejecutó todavía el desafío completo ni una carga con este modo; sigue pendiente la prueba en navegador y Preview.

## Servicios reales de protección — 06/11/2026

- La base real de Upstash permitió cuatro intentos sintéticos y bloqueó el quinto; la cuota de lectura también permitió la prueba. No se subieron archivos ni se usó una IP de visitante.
- Cloudflare rechazó un token deliberadamente inválido sin indicar secreto inválido. No se comprobó todavía el desafío real, la correspondencia entre claves ni la validación de acción y dominio desde navegador.

## Álbum privado y protecciones locales — 06/11/2026

- Los controladores reales del álbum usaron Drive real y un contador simulado local: acceso sin cookie devolvió 401, secreto incorrecto 403, listado autenticado entregó 14 archivos y rangos autenticados de foto y video devolvieron HTTP 206 y 100 bytes. Falta revisión visual y reproducción en navegador.
- Siete pruebas automatizadas de la API comprueban límite de lote, cuota, fallos del contador y desafío, token inválido, dominio incorrecto y solicitud válida. Build y 29 pruebas correctos. Los servicios externos reales no se configuraron ni verificaron.

## Interrupción controlada con Drive — 06/11/2026

- Una imagen PNG válida de 9,739,098 bytes se envió con la lógica real de carga. Se inyectó un fallo antes del segundo bloque, tras registrar 86 %, y se reintentó con la misma sesión. Drive confirmó el 100 %; el SHA-256 de la descarga coincidió con el original.
- Esta prueba simula el fallo en el programa; no acredita una desconexión física ni el flujo completo de la interfaz del navegador. Se creó `prueba-interrupcion-camila.png` en la carpeta de Drive.

## Recuperación de cargas — 06/11/2026

- Build correcto y 22 pruebas correctas. Pruebas automatizadas cubren interrupción, reanudación desde un bloque confirmado y carga ya completada sin repetir contenido.
- Drive real confirmó la subida parcial y la reanudación de una imagen válida mediante la misma sesión; se observó `Range` expuesto al origen local. La conexión interrumpida de verdad desde navegador sigue pendiente, así como cierres de página y caducidad de sesión; no se conserva la sesión tras recargar o cambiar selección.

## Video e interrupción — 06/11/2026

- La usuaria confirmó la reproducción del video cargado en Drive.
- Por inspección del código, una pérdida de red que también impida la consulta inmediata de estado termina el intento; volver a pulsar crea nuevas sesiones. Falta corregir y probar la reanudación y posibles duplicados.

## Lote desde navegador local — 06/11/2026

- Tras solicitar una prueba de video y de varios archivos, la usuaria informó que todo subió, incluso varios a la vez. No se recibió confirmación de reproducción ni de comportamiento al interrumpir la conexión.

## Foto desde navegador local — 06/11/2026

- La usuaria mostró una carga al 100 % y confirmó que las fotos llegaron a Drive después de corregir el origen de la sesión. Evidencia aportada por la usuaria; no se compararon bytes.
- Pendiente: video, varios archivos, reanudación, álbum privado y protecciones reales. La prueba local no acredita la configuración desplegada.

## Protección contra abuso y álbum privado — 06/11/2026

- `npm run build`: correcto (TypeScript y Vite 8.3.5).
- `npm test`: 3 archivos y 19 pruebas correctos.
- Revisión de código: el endpoint aplica límite 1–20 y verifica cada archivo en servidor; el desafío Turnstile se valida en servidor con acción y hostname; las cuotas usan Redis compartido y datos IP HMAC; errores de configuración o servicios bloquean la escritura.
- Revisión de privacidad: secreto de la galería enviado en fragmento y borrado del historial; cookie temporal firmada y HttpOnly; listado y descarga requieren cookie, marcador y carpeta; nombres se renderizan escapados por React; contenido sale por proxy y no se publican permisos de Drive.
- La revisión visual en navegador local no fue posible: el host de navegador de control no estuvo disponible. Tampoco se probaron APIs externas, credenciales ni tráfico a Drive; las variables de protección no están configuradas y las cargas siguen desactivadas. Preview debe validar compatibilidad, CORS, rangos de video y transferencia de Vercel.

## Autorización de Google Drive — 06/11/2026

- Corrección de referencia: `c1efc0c`; confirmación funcional: `87f8894`.
- Se revisaron en Chrome las APIs y los referentes de la clave: eran correctos. Se cambió la política del autorizador de `no-referrer` a `origin` y se fijó `setOrigin` en Picker.
- El servidor reiniciado respondió con `Referrer-Policy: origin` en una petición sin código OAuth; devolvió el 400 de validación de estado esperado. Esta comprobación no intercambió códigos ni expuso tokens.
- La usuaria completó consentimiento y selector; compartió la confirmación real de carpeta comprobada en Mi unidad y token guardado. No se leyó `.env` para repetir la comprobación.
- Sintaxis del autorizador, build y las 19 pruebas existentes correctos durante la corrección. No hubo prueba A/B para aislar los dos cambios de Picker, ni validación de uploads/renovación/borrado en producción.
- Las guías nuevas se contrastaron con el código y fuentes oficiales; se revisaron rutas locales y formato del diff. [Método y diagnóstico reutilizables](GOOGLE_DRIVE_REUTILIZABLE.md).

## Inversión exacta de las fotos de la portada de galería — 27/10/2026 22:20 (GMT−6)

- Se invirtieron las dos fotos de WhatsApp en la composición de la portada de galería (`.artwork`, `Gallery.tsx`):
  - `gallery-hero-main.webp` (atrás, 110.0 KiB): `multimedia/WhatsApp Image 2026-10-27 at 21.26.13.jpeg` (Camila sentada en el jardín con ramo violeta).
  - `gallery-hero-secondary.webp` (adelante, 107.8 KiB): `multimedia/WhatsApp Image 2026-10-27 at 21.25.53.jpeg` (Camila en la escalinata con vestido lavanda).
- Encuadres calibrados en `src/styles/gallery.css`: `object-position: 50% 50%` para la foto principal y `50% 26%` para la secundaria.
- Actualización de contrato en `docs/ASSETS.md` y `scripts/prepare-assets.mjs`.
- Verificación técnica: compilación `npm run build` sin errores y 19 pruebas de Vitest pasando.

## Inversión de fotos en portada de galería — 27/10/2026 22:15 (GMT−6)

- Se invirtieron las dos fotografías con Pascal en la composición de la portada de la galería (`.artwork`, `Gallery.tsx`):
  - `gallery-hero-main.webp` (261.2 KiB): `multimedia/Fotos XV Pri/Fotos XV Pri/_55A1329_(2).jpg` (Camila de pie con Pascal en el hombro).
  - `gallery-hero-secondary.webp` (170.0 KiB): `multimedia/Fotos XV Pri/Fotos XV Pri/_55A1154_(2).jpg` (Camila sentada en el pórtico con Pascal).
- Calibración de encuadres en `src/styles/gallery.css`: `object-position: 50% 22%` para la foto principal y `50% 42%` para la secundaria.
- Actualización de contrato en `docs/ASSETS.md` y `scripts/prepare-assets.mjs`.
- Verificación técnica: compilación `npm run build` sin errores y 19 pruebas de Vitest pasando.

## Desvanecido discreto en los extremos del hero — 27/10/2026 21:48 (GMT−6)

- Aplicado desvanecido vertical a los bordes superior e inferior de la obra del hero (`.magic-hero .art` y `.art-image`):
  - Máscara lineal vertical `mask-image: linear-gradient(to bottom, transparent 0%, ... black 16%, black 84%, ... transparent 100%)` en `.art`.
  - Calibración de la elipse radial de recorte en `.art-image` a 68% de radio vertical para fundir suavemente los bordes antes de llegar a los límites del contenedor.
  - Velo de integración suave en `.art::after` con los tonos de fondo `#160d23`.
- Verificación técnica: `npm run build` sin errores y 19 pruebas de Vitest pasando.

## Intercambio de fotos entre galería y acompañante — 27/10/2026 21:42 (GMT−6)

- Inversión de fotos según las capturas del usuario:
  - `companion.webp` (208.0 KiB): `multimedia/Imágenes/Galería 1.jpeg` (Camila con el caballo blanco).
  - `gallery-1.webp` (241.5 KiB): `multimedia/Imágenes/Foto con Pascal.jpg` (Camila frente a las columnas).
- Actualizadas las referencias y alts en `src/config/invitation.ts`, `src/components/scenes/Celebration.tsx`, `scripts/prepare-assets.mjs` y `docs/ASSETS.md`.
- Originales en `multimedia/` intactos.
- Comprobación: compilación `npm run build` sin errores y 19 pruebas de Vitest pasando.

## Actualización de fotos de la portada de galería — 27/10/2026 21:35 (GMT−6)

- Se generaron los derivados optimizados WebP para `gallery-hero-main.webp` (107.8 KiB) y `gallery-hero-secondary.webp` (110.0 KiB) desde los originales de WhatsApp especificados en `multimedia/` (`WhatsApp Image 2026-10-27 at 21.25.53.jpeg` y `WhatsApp Image 2026-10-27 at 21.26.13.jpeg`).
- Originales en `multimedia/` intactos.
- Verificación del contrato en `docs/ASSETS.md` y `scripts/prepare-assets.mjs`.
- Comprobación técnica: compilación `npm run build` sin errores y 19 pruebas de Vitest pasando.

## Ajuste y automatización de la portada mágica — 27/10/2026 21:26 (GMT−6)

- Sin interacción de puntero en la imagen (paralaje retirado).
- Retirados: botón principal «Descubre la magia», indicador «Desliza para soñar», nota «Hay historias que comienzan...», etiqueta «Camila · Mis XV años» y botón interactivo «Toca la luz».
- Acción de flor convertida en bucle automático: periódicamente emite destellos de estrellas (`sparkle`) desde la posición de la flor en la pintura y activa el destello de la obra, manteniendo activo el glow palpitante (`golden-aura` / `art-dust`).
- Cabecera fija previa restaurada (`InvitationHeader`), con su opacidad y comportamiento intactos.
- Build de producción Vite y 19 pruebas de Vitest superados con éxito.

## Hero portada jardín mágico — 27/10/2026 21:20 (GMT−6)

- Se integró la portada de `recursos/camila_portada_jardin_magico.html` en la escena 1 (`Scene01Flower` -> `MagicGardenHero`), conservando las 19 escenas y la secuencia simbólica intacta.
- Se optimizó `recursos/camila_jardin_encantado.webp` a `public/assets/production/photos/camila-jardin-encantado.webp` (101.4 KiB) mediante el pipeline reproducible `scripts/prepare-assets.mjs`; originales en `recursos` intactos.
- Glow palpitante (`.golden-aura` y `.art-dust` con animación infinita `breath`) activo y visible en el fondo de la obra.
- Interacción de flor con destellos (`sparkle`), realce momentáneo de la obra (`flash`), brindis visual (`wish-toast`), lienzo de partículas de neblina dorada y navegación fluida a la escena 2 (`#continuar`).
- Cabecera fija glass coordinada: oculta su monograma inicial cuando la portada está visible para evitar duplicidad y lo despliega suavemente al desplazarse hacia abajo.
- Verificación: `npm run build` y 19 pruebas de Vitest pasando sin errores.

## Vista previa al compartir — 27/10/2026 19:39 (GMT−6)

- Build y 19 pruebas correctos. Metadatos og:title/description/type/url/image y twitter:card/image presentes en el HTML estático de dist, sin depender de JavaScript.
- og:image apunta a https://mis-xv-camila.vercel.app/assets/production/photos/share-camila.jpg; archivo presente en dist con formato JPEG, 1200 × 630 y 63 130 bytes. Dimensiones y texto alternativo declarados.
- Encuadre revisado: foto principal completa centrada con fondo difuminado de la misma fotografía, sin modificar hero ni originales. Script reproducible scripts/prepare-social-image.mjs.
- No se publicó ni se compartió un mensaje real. Pendiente comprobar cómo presenta la tarjeta cada app después del despliegue; el formato y la caché los controla la plataforma receptora.

## Cabecera fija, Completo y música flotante — 27/10/2026 19:22 (GMT−6)

Historia: efectos completos sin selector; cabecera fina que permanece arriba y adopta cristal al desplazarse; botón de música que acompaña al invitado cuando el original sale de vista, conservando la canción.

- Build TypeScript/Vite y 19 pruebas correctos. Retiradas las tres pruebas del selector eliminado. Revisión independiente sin bloqueantes de efectos, header, galería, portal de audio, foco y limpieza de listeners/observers/rAF.
- Producción local mediante vite preview. Chromium 390 × 844 con reduce=true y localStorage camila-motion=paused: data-motion full y partículas float-up; ningún selector de ambiente ni gallery-playback.
- Header semántico HEADER, 44 px en las vistas probadas, top 0 durante el recorrido. Transparente en inicio; al desplazarse class is-scrolled y backdrop-filter blur(16px) saturate(1.45). Sin desbordamiento a 390 y 1440 px.
- Reproducción real iniciada mediante clic: tiempo 1.05 s inline → 3.07 s flotante, playing=true, misma identidad de HTMLAudioElement y exactamente un audio. Botón flotante 60 × 60 px, right 374 y bottom 828 en viewport 390 × 844, a 16 px de los bordes. Foco transferido al botón flotante; inline aria-hidden true y sin tabulación.
- Pausa desde flotante y regreso al original: mismo audio y tiempo conservado, foco inline, visibilidad visible y sin portal. Botón de audio fuera de GSAP para evitar desvanecerse antes de la transición geométrica.
- Regresión corregida: un salto lago → inicio podía mantener un estado obsoleto porque ambos nodos seguían fuera de intersección. Ahora la medición agrupada por rAF da: inicio sin flotante ni glass → retrato con ambos → lago sin flotante → inicio sin ambos → retrato con ambos → música inline con glass.
- Galería avanza 01 → 02 tras 3300 ms con modo Completo y sin botón pausa/reanudación. Se mantienen siete fotos y 19 escenas. Sin errores de aplicación registrados. Capturas locales .qa/header-top-mobile.png, .qa/header-audio-mobile.png y .qa/header-audio-desktop.png.
- Sin push ni despliegue; queda revisar la publicación en Android físico cuando se autorice publicar.

## Ambientes sin cambiar ajustes del teléfono — 27/10/2026 19:04 (GMT−6)

Sustituye la política anterior de desactivar todos los efectos al detectar movimiento reducido. Historia: incluso con esa preferencia activa, el invitado ve luz y fundidos automáticamente y puede elegir la experiencia completa dentro de la página, sin cambiar Android.

- Build correcto y 22 pruebas. Pruebas de preferencia inicial, elección explícita Completo/Suave/Sin efectos y descarte de valores inválidos. Revisión independiente de React y CSS sin bloqueantes.
- Chromium móvil 390 × 844 con `reduce=true` y sin elección guardada: modo gentle, partículas `atmosphere-glow`, opacidad 0.116 → 0.139 tras 900 ms y transform none. 45 animaciones CSS medidas tras implementar la luz suave; documento de 390 px sin desbordamiento.
- Con el mismo SO reducido, elegir Completo produce `float-up` y 71 animaciones CSS medidas; recargar conserva modo full y localStorage full. Son mediciones durante esa visita, no un número fijo de efectos.
- Sin efectos: cero animaciones CSS y cero elementos data-reveal con opacidad cero tras cambiar desde Completo. La reversión del contexto GSAP limpia los estados anteriores.
- Galería Suave: 01 → 02 después de 6400 ms, una tarjeta visible y una accesible; transform de centrado sin escala ni rotación. Pausar galería muestra Reanudar galería y mantiene el mismo capítulo tras 6400 ms. En Sin efectos la navegación es manual.
- Build de producción servido mediante vite preview, móvil/escritorio: modo gentle automático con reduce=true, pseudo-elementos de flor y marco con gentle-glow y 19 escenas conservadas. Capturas en .qa/motion-controls-mobile.png y .qa/motion-gentle-desktop.png. Sin errores de aplicación registrados.
- No se publicó ni se comprobó en un Android físico. La versión pública seguirá con la política anterior hasta el siguiente despliegue autorizado.

## Ampliación de galería y diagnóstico Android — 27/10/2026 18:58 (GMT−6)

Historia: recorrer las siete fotografías, incluidas las dos nuevas de Fotos XV Pri, y distinguir un fallo de despliegue de la preferencia de movimiento del dispositivo.

- Build correcto y 19 pruebas. Regresión de estados de la baraja circular para cinco/siete fotos, vecinos al cruzar el inicio y tres tarjetas principales accesibles. Revisión independiente sin hallazgos.
- Chromium móvil 390 × 844: siete imágenes decodificadas, ciclo 01 → 07 → 01, tres tarjetas accesibles en cada paso y documento de 390 px sin desbordamiento. Escritorio 1440 × 1000, sin desbordamiento. Capturas en `.qa/`, ignoradas.
- Con movimiento normal y galería visible, autoplay 07 → 01 después de 3300 ms; fuera de pantalla se pausa. Con movimiento reducido se conserva navegación manual y no se fuerzan animaciones.
- Producción `https://mis-xv-camila.vercel.app/`: viewport de 390 px, `reduce=false`, 52 animaciones CSS y partículas `float-up` con transform distinto después de 600 ms. Emulación `reduce=true`: cero animaciones CSS y `animationName=none`. GSAP y autoplay también condicionados por esa preferencia en código.
- Android/Chrome del usuario: síntoma compatible con «Quitar animaciones», pendiente de confirmar en el teléfono. La emulación de escritorio no sustituye comprobar su ajuste real. Vite no es causa de la desactivación observada. Fuentes: [Google sobre movimiento reducido](https://web.dev/articles/prefers-reduced-motion), [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite).
- Sin envío de datos, push ni despliegue. Originales intactos.

27 de octubre de 2026. Historia: el invitado recorre 19 escenas, elige escuchar música, consulta fecha/lugar, explora fotografías y prepara su confirmación en WhatsApp. Los recuerdos tienen una página independiente cuyo almacenamiento aún no está conectado.

## Comprobado
- Build de producción con TypeScript y Vite 8.
- Ocho pruebas Vitest: instante de Denver, contador antes/después, calendario, WhatsApp con acentos/caracteres de URL, nombre/cantidad y validación de archivos.
- Auditoría de instalación tras actualización: cero vulnerabilidades reportadas.
- Navegador Chromium, 390 × 844 y 1440 × 1000: sin desbordamiento horizontal; 19 escenas en orden; última escena 19; sin imágenes rotas detectadas ni errores de aplicación en consola.
- Galería al extremo final: indicador 05/05 y botón siguiente deshabilitado en ambos tamaños.
- Lago móvil: capa de lámparas con la misma altura que la escena (802 px), reflejos anclados al lago.
- Audio inicialmente detenido y sin datos descargados (`paused=true`, `readyState=0`); después de interacción `paused=false`, sin error. Pausa también accionada en navegador.
- RSVP con nombre de prueba María José y tres asistentes: URL capturada a `wa.me/17202369330`, texto correcto y acentos codificados. No se envió mensaje. Enlace de respaldo por si se bloquea la ventana emergente.
- Movimiento reducido: cero elementos de revelado ocultos, cero animaciones activas, audio detenido, sin desbordamiento.
- `/recuerdos` abre directamente. Selección de una foto WebP comprobada; interfaz conserva advertencia de que todavía no hay envío.
- SHA256 antes/después de preparar recursos: originales intactos; hero se conserva al repetir script.
- Comprobación local de secretos: 62 archivos de aplicación, documentación, recursos y build sin valores de credenciales del entorno. `.env`, capturas y originales excluidos de Git.
- Fondos forest/lake generados con Google y revisados visualmente. Capturas locales temporales en `.qa/`, excluidas del repositorio.

## Límites de esta entrega
- Falta revisión sobre dominio real y teléfonos físicos/iOS, incluyendo gesto de swipe y apertura de WhatsApp/Maps en aplicaciones nativas.
- Maps usa exactamente el enlace entregado; no se verificó la ruta de navegación real.
- QR tiene la misma URL de destino que el botón y usa el origen actual; falta escaneo físico del dominio definitivo antes de imprimir.
- La selección de archivos no equivale a carga. Backend, progreso, reanudación, almacenamiento Drive y borrado por retención siguen pendientes.
- No se ha medido Lighthouse ni hecho una prueba en red móvil lenta.
- La flor plana no permite apertura real de pétalos separados; esta entrega usa luz y escala. Los textos nuevos están pendientes de aprobación visual/familiar.

## Mejora visual — 27/10/2026

- Hero sustituido por `principal.jpg` mediante el preparador existente, conservando ruta y dimensiones. Encuadre revisado en escritorio.
- Espacios reducidos entre escenas; apertura sin altura mínima de pantalla completa. Se mantiene la secuencia de 19 escenas.
- Capa global fija con 26 partículas y 12 lámparas, sin capturar eventos, debajo del contenido. El centro tiene menor intensidad. Scroll actualiza variables CSS mediante RAF, sin renders React, y ResizeObserver recalcula ante cambios de altura.
- Móvil 390 × 844: ancho de documento 390, 19 escenas, ninguna imagen rota, audio detenido. Opacidades de partículas/lámparas al 50%, 60%, 66.67%, 75% y 90%: 0.926/0, 0.370/0, ~0/0, 0/0.463 y 0/1. Se mide el centro del viewport respecto de la altura total del documento.
- Escritorio 1440 × 1000: ancho 1440, 19 escenas, ninguna imagen rota; foto revisada visualmente. Lago móvil revisado, sin controles posteriores.
- Movimiento reducido: media query confirmada, cero animaciones activas y cero revelados ocultos; en lago partículas 0 y lámparas 1, ancho 390. Sin errores de aplicación reportados por el navegador.
- Build y ocho pruebas pasan tras detectar cambios simultáneos ajenos. Las capturas finales reflejan la combinación con esos cambios (marcos y animaciones); se conserva su trabajo y se excluye del commit de esta tarea.
- Capturas locales en `.qa/`, ignoradas por Git. Sin push ni despliegue.
- Se exportó el índice preparado a `.qa/staged` para comprobar solo la tarea: build y ocho pruebas correctos también sin los cambios simultáneos.
- En esa copia se corrigió `height: auto` del hero para que el atributo HTML de 1600 no imponga altura fija. Encuadre aislado revisado: imagen 346 × 461 en móvil y 618 × 824 en escritorio, sin desbordamiento y con texto legible.

## Galería narrativa — 27/10/2026 18:28 (GMT−6)

Historia verificada: el invitado descubre las cinco fotografías seleccionadas en una portada editorial, un carrusel narrativo y un diálogo de modo cine, dentro de la escena 10. Esta implementación sustituye la galería horizontal descrita en la verificación inicial.

- Referencia local: `recursos/galeria_camila_carrusel_narrativo.html`; estilos aislados en `src/styles/gallery.css`, contenido de capítulos en `src/config/invitation.ts`. Los originales no se modificaron y no se incorporaron imágenes incrustadas de la referencia.
- Build TypeScript/Vite correcto y 16 pruebas existentes correctas.
- Chromium escritorio 1440 × 1000 y móvil 390 × 844: revisión visual de portada, carrusel y modo cine; 19 escenas conservadas, cinco imágenes cargadas y sin desbordamiento horizontal ni errores de aplicación registrados.
- Secuencia automática: indicador avanzó de 03 a 04 tras 3100 ms. Sin botón de secuencia ni barra «Cinco instantes, una historia». Flechas, miniaturas y Escape disponibles; el diálogo nativo limita el foco y bloquea el scroll del fondo.
- Revisión independiente corrigió remontaje de navegación que perdía el foco, cierre invisible en móvil y cambio automático mientras se interactúa con teclado. Navegación del diálogo comprobada con conservación del foco.
- Movimiento reducido: indicador estable tras 3200 ms y cero animaciones activas en las tarjetas. Navegación manual disponible; la secuencia se pausa también fuera de pantalla y cuando la pestaña está oculta.
- Capturas temporales de navegador fuera del repositorio; sin push ni despliegue. Falta validación en teléfonos físicos, ya indicada en los límites generales.

## Tarjeta RSVP ? 2026-10-27 18:49 (GMT?6)

Historia: el invitado selecciona asistencia, escribe su nombre y prepara el mensaje; revisa el texto y abre el enlace al WhatsApp configurado para enviarlo manualmente. Flujo est?tico sin backend ni nuevas variables de entorno.

- Build TypeScript/Vite y 16 pruebas existentes correctos. Revisi?n independiente de React, validaci?n y aislamiento CSS sin bloqueantes.
- Chromium: escritorio 1440 ? 1100 y m?vil 390 ? 844; tarjeta revisada visualmente, 19 escenas conservadas y ancho de documento m?vil de 390 px.
- Nombre vac?o muestra error y recibe el foco. Mar?a Jos? & familia, dos asistentes y nota con acentos generan un ?nico par?metro text y destino wa.me/17202369330.
- Respuesta negativa oculta el contador y genera agradecimiento sin afirmar asistencia. Di?logo nativo abre con foco en cerrar; Escape lo cierra y restaura el foco. No se env?an mensajes reales.
- Movimiento reducido: preferencia activa, tarjeta con opacidad 1 y animationName none; sin desbordamiento m?vil.
- Original HTML conservado. No se verific? env?o externo ni tel?fonos f?sicos.
