# Pasos para habilitar recuerdos con Google Drive

Esta guía separa las acciones que necesito de Camila de la implementación que haré en el proyecto. No compartas contraseñas, secretos de OAuth ni tokens en el chat.

Para reproducir el método en otro proyecto, consultar [Google Drive con OAuth y Picker: método reutilizable](GOOGLE_DRIVE_REUTILIZABLE.md). Incluye arquitectura, contratos del script, diagnóstico del incidente, adaptación y límites de producción; esta guía conserva las decisiones propias del evento.

## Decisiones ya tomadas

- Los archivos se guardarán en la carpeta de Drive `Mis-XV-Camila`.
- La galería será privada y se abrirá con un enlace secreto. Cualquier persona que reciba o reenvíe ese enlace podrá entrar.
- La página de carga está en `/recuerdos`; el botón «Ver álbum» abre `/album`, que requiere el enlace privado o una sesión ya autorizada.
- Al seleccionar archivos se muestran miniaturas con un velo claro que se retira desde abajo conforme se envían; se descubren por completo cuando Drive confirma la carga. Los videos se identifican y, si el navegador no admite una vista previa, aparece una alternativa. Los nombres y el progreso siguen disponibles para lectores de pantalla.
- Límites actuales: 20 archivos por lote, 20 MB por foto y 400 MB por video.
- Las cargas cierran el 7 de diciembre de 2026 a las 00:00, hora de Denver. La configuración contempla conservar los archivos 90 días.
- El `.env` local ya tiene variables llamadas `GOOGLE_CLIENT_ID` y `GOOGLE_SECRET`. No hay que volver a enviarme sus valores.

## Paso 1: datos que necesito ahora

1. **Identifica la cuenta de Google que es dueña de la carpeta** `Mis-XV-Camila`. Debe ser la cuenta que autorizará la aplicación y tener espacio disponible en Drive.
R: temikia.agency@gmail.com

2. **Obtén el ID de la carpeta**: ábrela en Google Drive y copia solo la parte que aparece después de `/folders/` en la dirección. Envíame ese ID y dime si la carpeta está en “Mi unidad” o en una unidad compartida. No cambies el uso compartido a “cualquier persona”.
R: 1nRdKntaJdXVdH_FvbLijCxCA3g_zbohM
3. **Confirma el proyecto de Google Cloud** del que proceden las credenciales OAuth que ya subiste. En ese proyecto, habilita **Google Drive API**. [Guía oficial para habilitar APIs](https://developers.google.com/workspace/guides/enable-apis).
R: Listo
## Paso 2: OAuth en Google Cloud

Haz esto en el mismo proyecto de Cloud:

1. Abre **Google Auth Platform** y completa **Branding** con el nombre de la invitación y un correo de contacto.
2. Revisa **Audience**. Si la cuenta es Gmail personal, la audiencia normalmente será externa; agrega la cuenta propietaria de la carpeta como usuario de prueba si el proyecto está en modo de pruebas.
3. Mantén la aplicación en pruebas por ahora. Cuando el código esté listo, te indicaré el permiso exacto que usará y si hace falta cambiar el estado de publicación. No añadas permisos ni publiques la aplicación antes de esa revisión.
4. No crees ni compartas una clave de cuenta de servicio. Para esta carpeta usaremos la autorización OAuth de la cuenta propietaria.

R: Todo OK

## Permiso previsto para la integración

La integración utiliza `https://www.googleapis.com/auth/drive.file` junto con `openid` y `email` para identificar a la cuenta autorizada. `drive.file` limita el acceso a los archivos que la usuaria cree o seleccione explícitamente para la app; no da acceso general a todo Drive. La carpeta existente se autorizó mediante Google Picker y se verificó el ID `1nRdKntaJdXVdH_FvbLijCxCA3g_zbohM`. Picker API y la clave restringida a la pantalla local ya están configuradas. La carpeta permanece privada; el selector de autorización no se ejecuta en la preview pública.

El consentimiento y el guardado local ya se completaron. En estado de pruebas, Google puede caducar el token de actualización de Drive a los siete días; no se activarán cargas de invitados hasta resolver la vigencia de la autorización.

Google requiere acceso sin conexión para que el servidor pueda renovar la autorización cuando la cuenta no esté abierta. En modo de pruebas, un token OAuth de Drive puede caducar a los siete días; lo revisaremos antes de activar las cargas para invitados. [OAuth de servidor](https://developers.google.com/identity/protocols/oauth2/web-server) · [Caducidad del token en modo de pruebas](https://developers.google.com/identity/protocols/oauth2#expiration).

## Paso 3: autorización y secretos

El código local ya está preparado en `scripts/authorize-drive.mjs`. Autorización local completada: carpeta verificada en **Mi unidad** y token guardado en `.env`, confirmado por la usuaria. La corrección de `Referrer-Policy: origin` permitió validar la clave restringida sin enviar los parámetros OAuth como referente.

1. En el mismo proyecto de Cloud, habilita **Google Picker API**. Crea una clave API y restríngela a Google Picker API y a estos referentes: `http://127.0.0.1:8788/*` y `https://docs.google.com/*` (el selector se abre dentro de un iframe de Google). Guarda esa clave en `GOOGLE_PICKER_API_KEY` de tu `.env` local, reemplazando cualquier valor anterior. `scripts/authorize-drive.mjs` lee la variable al iniciar, así que después de cambiarla hay que detener y volver a iniciar el proceso. El navegador recibe la clave para abrir Picker; no es un secreto OAuth, por lo que su seguridad depende de sus restricciones de API y referentes.
2. En el cliente OAuth, agrega el origen JavaScript autorizado `http://127.0.0.1:8788` y el URI de redirección autorizado `http://127.0.0.1:8788/oauth2callback`. No cambies el estado de publicación de la app.
3. Ejecuta `npm run drive:authorize`. Abre el enlace que muestra la terminal e inicia sesión con `temikia.agency@gmail.com`. Revisa el permiso exacto: `drive.file`, `openid` y `email`. No concede acceso general a Drive.
4. En el selector de Google, elige la carpeta `Mis-XV-Camila` y confirma. El script verifica cuenta e ID y guarda `GOOGLE_REFRESH_TOKEN` y `DRIVE_FOLDER_ID` en el `.env` ignorado por Git. No imprime el token ni lo envía al chat.
5. En Vercel, abre **Settings → Environment Variables** y crea para **Preview** y **Production** `GOOGLE_CLIENT_ID`, `GOOGLE_SECRET`, `GOOGLE_REFRESH_TOKEN`, `DRIVE_FOLDER_ID` y `CRON_SECRET`. Para habilitar las cargas también harán falta `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` y `ABUSE_HASH_SECRET`. Para habilitar el álbum privado, configura además `MEMORIES_GALLERY_SECRET`. `TURNSTILE_SITE_KEY` es pública; las demás credenciales son de servidor. Nunca uses prefijo `VITE_`. Mantén `DRIVE_UPLOADS_ENABLED` sin configurar hasta terminar las pruebas en Preview y confirmar que la autorización OAuth sigue vigente.
6. Guarda las variables y despliega una nueva preview para que Vercel las cargue. [Documentación de variables de entorno de Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables).

### Si Google Picker muestra “The API developer key is invalid”

Este mensaje aparece después de volver al callback local y significa que Picker rechazó `GOOGLE_PICKER_API_KEY`; no es un rechazo del consentimiento OAuth. En Google Cloud Console, confirma en el mismo proyecto que:

1. **Google Picker API** está habilitada.
2. La variable local `GOOGLE_PICKER_API_KEY` contiene la clave API vigente, no una clave anterior; reemplazarla en Google Cloud no actualiza automáticamente `.env`.
3. Si la clave tiene restricción de sitios web, incluye exactamente `http://127.0.0.1:8788/*` y `https://docs.google.com/*`. Picker se carga dentro de un iframe en `docs.google.com`; omitir ese referente produce este error.
4. Si la clave tiene restricción por API, permite **Google Picker API**. Añade también **Google Drive API** si la clave se usa en solicitudes directas a Drive.

El autorizador debe enviar `Referrer-Policy: origin` para que Google valide el referente sin recibir el código OAuth de la URL. `no-referrer` elimina el dato necesario para las restricciones por sitio web. El origen del selector se fija explícitamente a `http://127.0.0.1:8788`.

La lista de credenciales puede resumir las restricciones como “URL de referencia HTTP, 1 API”; abre la clave y confirma que esa API sea **Google Picker API**. Si solo permite Google Drive API, Picker la rechazará. No hace falta rotar la clave únicamente porque aparezca en una captura; conserva las restricciones y evita volver a mostrar el valor.

Después de corregirlo, espera a que se aplique el cambio, detén el proceso local con `Ctrl+C` y vuelve a ejecutar `npm run drive:authorize` para iniciar una autorización nueva. Si rotaste o creaste otra clave, reemplázala primero en `.env`. No reutilices ni compartas la dirección completa del callback. El token solo queda guardado después de elegir y verificar la carpeta.

Las cargas grandes usan el mecanismo reanudable de Drive para tolerar interrupciones de red y evitar enviar videos de cientos de MB en una sola petición al servidor. La función de Vercel solo inicia cada sesión; el navegador transfiere los datos directamente a Google Drive. [Cargas reanudables de Drive](https://developers.google.com/workspace/drive/api/guides/manage-uploads).

## Paso 4: dos decisiones operativas antes de activar

- **Quién puede subir:** ✅ cualquiera con el enlace/QR de la invitación. La galería conserva un enlace secreto independiente. Turnstile y límites compartidos de frecuencia están implementados; falta configurar sus servicios en Preview y probarlos antes de activar.
- **Cuándo borrar:** ✅ los 90 días se cuentan desde el cierre de cargas: 7 de diciembre de 2026 a las 00:00, hora de Denver. La limpieza programada empieza el 7 de marzo de 2027 a las 00:00 de Denver (07:00 UTC). Solo borra archivos creados por esta integración; el resto de la carpeta no se toca.
- **Ubicación de carpeta:** el flujo local consulta Drive y confirma si está en “Mi unidad” o en una unidad compartida. Si está en una unidad compartida, exige que la cuenta pueda borrar archivos (rol de organizadora) para respetar la retención.

## Protección contra abuso y álbum privado

- Las cargas se agrupan en una sola solicitud de hasta 20 archivos. El backend verifica cada metadato y el token de Turnstile en Cloudflare antes de abrir sesiones de Drive.
- Upstash Redis lleva un contador compartido entre instancias de Vercel: hasta cuatro lotes de carga por IP en una ventana de 60 segundos. Los endpoints de lectura del álbum limitan 120 solicitudes por IP por minuto. Se usa `x-real-ip` de Vercel; Redis no guarda la IP, solo una huella HMAC con `ABUSE_HASH_SECRET`, y las claves caducan al minuto. Si Turnstile o Redis no responden, las cargas fallan cerradas.
- Crea un widget de Turnstile para los dominios de Preview y Production y registra su clave pública y secreta en las variables anteriores. La clave pública solo se entrega en la respuesta de configuración; la secreta se valida exclusivamente desde el servidor.
- Genera dos valores aleatorios distintos localmente para `ABUSE_HASH_SECRET` y `MEMORIES_GALLERY_SECRET` (por ejemplo, con `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`) y guárdalos directamente en Vercel; no los pegues en el chat ni en archivos versionados. Usa al menos 32 caracteres.
- Para el enlace secreto, combina el dominio con el valor de `MEMORIES_GALLERY_SECRET`: `https://<dominio>/album#<secreto>`. Los enlaces anteriores `/recuerdos?album=1#<secreto>` se redirigen a `/album`. El fragmento se canjea por una cookie `HttpOnly`, `Secure` y `SameSite=Strict` que dura 24 horas; luego se quita de la barra del navegador. Si Preview y Production usan secretos diferentes, genera un enlace por entorno.
- La lista y los archivos se entregan mediante funciones autenticadas; la carpeta Drive sigue privada. El proxy transmite rangos HTTP para video, por lo que la revisión en Preview debe comprobar reproducción y consumo de transferencia de Vercel. Quien reciba o reenvíe el enlace podrá ver el álbum, de acuerdo con la decisión del evento.

## Paso 5: revisión contigo en la preview

Antes de Preview se puede probar la carga real en esta computadora con `npm run dev:recuerdos`, abriendo `http://127.0.0.1:5188/recuerdos`. El álbum local se abre desde `http://127.0.0.1:5188/album-local` y usa los controladores reales, un secreto temporal y un contador simulado en memoria. Este servidor aislado no prueba Turnstile ni Upstash reales; no sustituye la revisión de esas protecciones ni las pruebas en Preview. Los archivos de prueba se crean en la carpeta real de Drive y pueden borrarse allí. El acceso local deja de funcionar al detener el servidor y cambia al reiniciarlo.

Para probar las protecciones reales en esta computadora, guardar en `.env` las claves del widget exclusivo de `127.0.0.1` como `LOCAL_TURNSTILE_SITE_KEY` y `LOCAL_TURNSTILE_SECRET_KEY`, sin sustituir las claves del dominio público. Con Upstash configurado, ejecutar `npm run dev:seguridad` y abrir `http://127.0.0.1:5188/recuerdos`. Esta modalidad ejecuta la API real, solo escucha en localhost y activa cargas únicamente dentro de ese proceso. Una foto completó la carga en navegador con Turnstile y Upstash reales; detener el otro servidor antes de usar el mismo puerto. La revisión en Preview sigue pendiente.

La sesión de carga se inicia con el origen validado de la página para que Google permita al navegador leer la respuesta. Si aparece un error de red, revisar primero la carpeta: Google podría haber recibido el archivo aunque el navegador no haya podido confirmar la respuesta.

Para reintentar una interrupción, recuperar la conexión y pulsar de nuevo sin recargar ni cambiar la selección: el cliente consulta a Drive y conserva las sesiones y archivos terminados durante esa visita. Al recargar, cerrar o cambiar la selección se pierde ese estado; revisar Drive antes de empezar de nuevo. La desconexión real desde navegador queda pendiente de verificar.

Cuando te comparta la preview, necesitaremos probar desde un teléfono:

1. Subir una foto y comprobar que aparece en la carpeta correcta y en la galería privada.
2. Probar un video y una interrupción de red para confirmar que la carga se reanuda y muestra su estado real.
3. Abrir la galería con el enlace secreto y confirmar que la carpeta no se hizo pública.
4. Confirmar el cierre de cargas y la regla de eliminación programada.
5. Revisar CORS desde el navegador y cómo detectar contenido que no corresponde a su extensión/MIME declarado; el backend no recibe los bytes durante la transferencia directa.

La implementación ya está preparada, pero el álbum y las cargas permanecen apagados hasta configurar y probar las variables anteriores. Los archivos siguen privados en Drive; no se hará pública la carpeta.

## Referencias

- [Validación server-side de Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) · [configuración del widget](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
- [Upstash Redis REST API y transacciones](https://upstash.com/docs/redis/features/restapi) · [encabezados de solicitud en Vercel](https://vercel.com/docs/headers/request-headers)
- [Descargar contenido de Drive](https://developers.google.com/workspace/drive/api/guides/manage-downloads)
- [Integración oficial de Picker](https://developers.google.com/workspace/drive/picker/guides/web-picker)
- [Método reutilizable e incidente resuelto](GOOGLE_DRIVE_REUTILIZABLE.md)

- [Habilitar APIs de Google Workspace](https://developers.google.com/workspace/guides/enable-apis)
- [OAuth 2.0 para aplicaciones de servidor](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Caducidad de tokens OAuth en pruebas](https://developers.google.com/identity/protocols/oauth2#expiration)
- [Cargas reanudables de Google Drive](https://developers.google.com/workspace/drive/api/guides/manage-uploads)
- [Variables de entorno en Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables)
