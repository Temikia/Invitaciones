# Pasos para habilitar recuerdos con Google Drive

Esta guía separa las acciones que necesito de Camila de la implementación que haré en el proyecto. No compartas contraseñas, secretos de OAuth ni tokens en el chat.

Para reproducir el método en otro proyecto, consultar [Google Drive con OAuth y Picker: método reutilizable](GOOGLE_DRIVE_REUTILIZABLE.md). Incluye arquitectura, contratos del script, diagnóstico del incidente, adaptación y límites de producción; esta guía conserva las decisiones propias del evento.

## Decisiones ya tomadas

- Los archivos se guardarán en la carpeta de Drive `Mis-XV-Camila`.
- La galería será privada y se abrirá con un enlace secreto. Cualquier persona que reciba o reenvíe ese enlace podrá entrar.
- La página de recuerdos está en `/recuerdos`.
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
5. En Vercel, abre **Settings → Environment Variables** y crea para **Preview** y **Production** `GOOGLE_CLIENT_ID`, `GOOGLE_SECRET`, `GOOGLE_REFRESH_TOKEN`, `DRIVE_FOLDER_ID` y `CRON_SECRET`. Son secretos de servidor salvo el ID de carpeta; nunca uses prefijo `VITE_`. Mantén `DRIVE_UPLOADS_ENABLED` sin configurar hasta completar la revisión de abuso y pruebas.
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

- **Quién puede subir:** ✅ cualquiera con el enlace/QR de la invitación. La galería conservará su enlace secreto por separado. Antes de activar se implementará protección contra abuso.
- **Cuándo borrar:** ✅ los 90 días se cuentan desde el cierre de cargas: 7 de diciembre de 2026 a las 00:00, hora de Denver. La limpieza programada empieza el 7 de marzo de 2027 a las 00:00 de Denver (07:00 UTC). Solo borra archivos creados por esta integración; el resto de la carpeta no se toca.
- **Ubicación de carpeta:** el flujo local consulta Drive y confirma si está en “Mi unidad” o en una unidad compartida. Si está en una unidad compartida, exige que la cuenta pueda borrar archivos (rol de organizadora) para respetar la retención.

## Paso 5: revisión contigo en la preview

Cuando te comparta la preview, necesitaremos probar desde un teléfono:

1. Subir una foto y comprobar que aparece en la carpeta correcta y en la galería privada.
2. Probar un video y una interrupción de red para confirmar que la carga se reanuda y muestra su estado real.
3. Abrir la galería con el enlace secreto y confirmar que la carpeta no se hizo pública.
4. Confirmar el cierre de cargas y la regla de eliminación programada.
5. Revisar CORS desde el navegador y cómo detectar contenido que no corresponde a su extensión/MIME declarado; el backend no recibe los bytes durante la transferencia directa.

La vista web de consulta de la galería con enlace secreto todavía no está implementada; los archivos permanecen privados en Drive y no se hará pública la carpeta.

## Referencias

- [Integración oficial de Picker](https://developers.google.com/workspace/drive/picker/guides/web-picker)
- [Método reutilizable e incidente resuelto](GOOGLE_DRIVE_REUTILIZABLE.md)

- [Habilitar APIs de Google Workspace](https://developers.google.com/workspace/guides/enable-apis)
- [OAuth 2.0 para aplicaciones de servidor](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Caducidad de tokens OAuth en pruebas](https://developers.google.com/identity/protocols/oauth2#expiration)
- [Cargas reanudables de Google Drive](https://developers.google.com/workspace/drive/api/guides/manage-uploads)
- [Variables de entorno en Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables)
