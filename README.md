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
- `/recuerdos` y `/album` tienen rewrite a la aplicación. QR y botones usan el mismo origen del despliegue.
- `noindex` evita indexación solicitada a buscadores; no representa control de acceso. El álbum no tiene galería pública.

El usuario administra el despliegue. Las cargas y el álbum están implementados, pero siguen apagados hasta configurar Cloudflare Turnstile, Upstash y las variables de Drive en Preview y completar las pruebas reales. No distribuir a invitados antes de esa revisión.

## Cambios de contenido y fotos

La invitación, recuerdos y álbum tienen la misma cabecera con selector **En | Es** y acceso al álbum. La preferencia se conserva en este dispositivo y también se aplica a la página de recuerdos (`/recuerdos`), las etiquetas accesibles y los metadatos de la página.

Todos los datos, mensajes, horarios y rutas viven en `src/config/invitation.ts`. La fecha tiene offset explícito y zona `America/Denver`, sin depender de la zona del navegador.

La vista previa al compartir el enlace usa Open Graph en `index.html` y `public/assets/production/photos/share-camila.jpg`. Si cambia el hero, regenerar con `node scripts/prepare-social-image.mjs` y publicar ambos cambios. Si cambia el dominio público, actualizar las URLs absolutas del HTML. La vista previa final depende de la app donde se comparta y de su caché.

La foto principal usa `multimedia/Imágenes/principal.jpg`, optimizada en la ruta fija `public/assets/production/photos/hero.svg`, proporción 3:4, 1200 × 1600. [Mapa de recursos y sustitución](docs/ASSETS.md). Los fondos fueron generados con la API de Google: [procedencia y prompts](docs/FONDOS.md).

La música solo se solicita después de pulsar reproducir. Su botón se vuelve flotante abajo a la derecha cuando el control original sale por arriba, conserva la misma reproducción y vuelve a su lugar al regresar; el flotante desaparece al llegar al lago. La cabecera C · XV permanece fija y adquiere un cristal casi transparente al desplazarse; en las tres rutas, «C · XV» lleva a la invitación (`/`) y la cámara al álbum. `/recuerdos` y `/album` ya no tienen enlace propio de regreso: se navega desde la cabecera. Las fotos posteriores cargan de forma diferida. Por decisión del usuario, la experiencia queda fija en Completo, sin selector de ambiente ni pausa/reanudación visible de galería; la secuencia se pausa al navegar con teclado, quedar fuera de pantalla o cambiar de pestaña. La flor suministrada es una imagen plana: la primera versión anima iluminación y escala; la apertura real de pétalos requiere un recurso separado por capas.

## Recuerdos: estado y operación

Para una prueba local, ejecutar `npm run dev:recuerdos` y abrir `http://127.0.0.1:5188/recuerdos`. El álbum local se abre en `http://127.0.0.1:5188/album` (la dirección anterior `/album-local` redirige ahí). Requiere la autorización de Drive guardada en `.env`. La prueba de carga omite Turnstile y Upstash, y el álbum usa un contador local simulado; las API desplegadas mantienen sus controles reales. Estas pruebas no acreditan la configuración de los servicios externos.

Las sesiones reanudables se crean con el origen validado de la página para permitir la respuesta de Google al navegador. Si un intento muestra error de red, revisar Drive antes de repetirlo: el archivo podría haberse recibido aunque no llegara la confirmación.

Si se interrumpe una carga, conserva abierta la página, recupera la conexión y pulsa nuevamente el botón: el navegador consulta a Drive y retoma la misma sesión. Los archivos ya completados no se envían otra vez. Las sesiones se conservan solo mientras la página y la selección sigan abiertas; recargar, cerrar o cambiar los archivos descarta ese estado. La prueba de desconexión real desde navegador sigue pendiente.

Documentación de Drive: [pasos y estado del evento](docs/PASOS_GOOGLE_DRIVE.md) · [método reutilizable, diagnóstico y adaptación a otros proyectos](docs/GOOGLE_DRIVE_REUTILIZABLE.md). La autorización local de la carpeta ya quedó completada; las cargas para invitados todavía requieren las validaciones indicadas abajo.

Antes de iniciar la carga, cada miniatura seleccionada tiene un botón «×» para quitarla, con nombre accesible y foco en el siguiente archivo; al empezar la carga desaparece. Hasta la hora del evento (`uploads.opensAt`, 22/11/2026 a las 17:00 de Denver) `/recuerdos` muestra solo el sol, el título, un texto breve, la cuenta regresiva y «Ver álbum»; a esa hora cambia sola a la carga, que sigue disponible hasta `closesAt`. Después, la ruta `/recuerdos` muestra la carga solo cuando el backend confirma que está configurado y habilitado; una preview incompleta mantiene oculta la selección. Un desafío Turnstile se verifica en servidor y Upstash aplica límites compartidos por IP; los dos controles fallan cerrados. El endpoint limita el lote a 20 y valida nombre, extensión, MIME declarado y tamaño antes de iniciar sesiones reanudables de Drive. El navegador transfiere bloques directamente y muestra progreso real. Como el backend no recibe los bytes, la inspección del contenido real y las pruebas CORS en teléfono siguen pendientes antes de activar. No informa éxito hasta que Google Drive completa la carga.

El álbum abre con una portada a pantalla casi completa que recorre, en orden aleatorio, las siete fotos de la galería de la invitación (4 s cada una, acercamiento lento y barras indicadoras, sin botones). No se detiene con el cursor ni con el foco (decisión de la usuaria); solo se pausa con la pestaña oculta o fuera de pantalla; con movimiento reducido muestra una foto fija. Debajo, un mosaico de tamaños variados (3 columnas en teléfono, 4 en tableta y 6 en escritorio) con filtros Todo/Fotos/Videos y conteo. Al abrir muestra 20 recuerdos (solo se piden esas miniaturas) y el botón violeta con borde dorado «Ver más» añade otros 20 cada vez; el foco pasa al primer recuerdo nuevo. Junto a «Ver como película», el botón «Subir mis fotos» lleva a `/recuerdos`; aparece desde 24 h antes del evento (`uploads.albumButtonFrom`) hasta el cierre de la carga. Entre la portada y el mosaico hay un separador con el sol de la invitación, y tanto el álbum como `/recuerdos` tienen partículas doradas y linternas ascendentes a los lados (quietas con movimiento reducido). Cada cuadro tiene un borde dorado con un destello que gira lentamente solo mientras está en pantalla (fijo con movimiento reducido). El visor permite pasar de un recuerdo a otro con flechas, teclado o deslizando el dedo (la foto sigue al dedo), con un fundido cruzado de 0.32 s entre recuerdos; los vecinos se precargan. Sus controles son iconos sueltos, sin círculo: alejar y acercar (de 100 % a 400 %, sin texto de porcentaje), girar y la X. La foto ampliada se mueve arrastrándola con el ratón o el dedo, sin salirse de sus bordes; también se acerca con la rueda, pellizcando, con doble clic o doble toque (100 % ↔ 200 %) y con las teclas + / − / 0. Acercar, alejar y girar solo cambian la presentación, nunca el archivo. «Ver como película» abre una presentación a pantalla completa de todo el álbum en orden aleatorio: cada foto se ve completa sobre una copia de sí misma ampliada y desenfocada que rellena el espacio sobrante (a los lados en pantallas horizontales, arriba y abajo en teléfono), dura 5 s y alterna acercamiento y alejamiento hacia seis puntos distintos. El zoom ocurre dentro de un marco fijo con la proporción de la foto, que no cambia de tamaño ni de lugar, para no marear; entre un recuerdo y el siguiente hay un fundido cruzado de 1.4 s en el que el anterior permanece debajo hasta que el nuevo termina de aparecer. La foto siguiente se monta oculta y decodificada mientras se ve la actual, así el fundido empieza en cuanto termina la barra, sin espera de carga. La X de cerrar es solo el icono, sin círculo: con ratón aparece al moverlo y se oculta (con el cursor) tras 2.5 s quieto; en pantallas táctiles siempre se ve. Con movimiento reducido no hay zoom y el fundido dura 0.4 s. Los videos se reproducen solo sus primeros 5 s y sin sonido; se cierra con el botón o Esc, avanza con las flechas o tocando los lados y se pausa con la barra espaciadora. El mosaico, el visor y la película usan miniaturas JPEG (`/api/drive/gallery/thumb`, lados de 480, 960 y 1920 px) en lugar de los originales: una foto de 41 MB se muestra con unos 41 KB en el mosaico y 300 KB a pantalla completa. Se toman de las que genera Drive (también para HEIC y videos); para fotos que Drive no procesa (≈50 MB o más) el servidor las reduce desde el original con `sharp`, que por eso pasó a dependencia de producción. El navegador las guarda un día. Si una miniatura no se puede obtener, el mosaico muestra un cuadro con ícono, el visor intenta el original y la película salta al siguiente recuerdo. Los videos se siguen transmitiendo desde el original. «Ver más» limita los elementos visibles, no el listado de la API.

El botón «Ver álbum» y la cámara a la izquierda de la cabecera abren `/album`. Desde el 07/11/2026 el álbum no requiere enlace secreto ni sesión: cualquiera que conozca la dirección puede verlo (decisión de la usuaria para simplificar). Los enlaces anteriores `/recuerdos?album=1#…` redirigen a `/album`. Los endpoints listan y transmiten solo archivos marcados por esta app dentro de la carpeta configurada, que sigue privada en Drive, y conservan el límite de 120 lecturas por IP y minuto; `noindex` pide a los buscadores no indexar. La guía de Drive documenta el alta de Turnstile y Upstash. La reproducción de video proxificada requiere probar `Range` y transferencia en Preview.

Funciones de Vercel crean sesiones de carga reanudable; el navegador envía los archivos directamente a Google Drive para evitar pasar videos de 400 MB por el body de una función. El proxy autenticado de galería transmite contenido de Drive y necesita revisar límites de tiempo y transferencia del plan elegido. El secreto OAuth y el refresh token no llegan al cliente de invitados. El sistema no usa el conector personal de Drive como backend de invitados.

El permiso previsto es `drive.file` más `openid` y `email`, con selección explícita de la carpeta mediante Google Picker. `npm run drive:authorize` ejecuta la autorización local, valida el acceso de borrado y guarda el token en `.env` sin imprimirlo. La carpeta sigue privada. En modo de pruebas, el token Drive puede caducar a los siete días. La limpieza diaria de Vercel empieza el 7 de marzo de 2027 a las 00:00 de Denver (programada a las 07:00 UTC) y elimina solo archivos marcados por la app. Las cargas siguen desactivadas hasta configurar las variables en Vercel, probar la integración en Preview y resolver la vigencia del token OAuth antes del evento.

Política elegida del checklist: 20 MB/foto, 400 MB/video, 20 archivos por lote, múltiples lotes, cierre al terminar el 6 de diciembre de 2026 (hora Denver), conservación 90 días desde el cierre del 7 de diciembre a las 00:00 Denver. La usuaria eligió acceso de carga para cualquiera con el enlace/QR. La limpieza programada empezará el 7 de marzo de 2027 y solo afectará archivos creados por la app. El texto “sin límite” de otra sección se interpreta como número de lotes sujeto al espacio disponible, conservando los límites concretos por archivo.

Para retomar: [estado y siguientes fases](docs/EN_CURSO.md).
