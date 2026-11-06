# Pasos para habilitar recuerdos con Google Drive

Esta guía separa las acciones que necesito de Camila de la implementación que haré en el proyecto. No compartas contraseñas, secretos de OAuth ni tokens en el chat.

## Decisiones ya tomadas

- Los archivos se guardarán en la carpeta de Drive `Mis-XV-Camila`.
- La galería será privada y se abrirá con un enlace secreto. Cualquier persona que reciba o reenvíe ese enlace podrá entrar.
- La página de recuerdos está en `/recuerdos`.
- Límites actuales: 20 archivos por lote, 20 MB por foto y 400 MB por video.
- Las cargas cierran el 7 de diciembre de 2026 a las 00:00, hora de Denver. La configuración contempla conservar los archivos 90 días.
- El `.env` local ya tiene variables llamadas `GOOGLE_CLIENT_ID` y `GOOGLE_SECRET`. No hay que volver a enviarme sus valores.

## Paso 1: datos que necesito ahora

1. **Identifica la cuenta de Google que es dueña de la carpeta** `Mis-XV-Camila`. Debe ser la cuenta que autorizará la aplicación y tener espacio disponible en Drive.
2. **Obtén el ID de la carpeta**: ábrela en Google Drive y copia solo la parte que aparece después de `/folders/` en la dirección. Envíame ese ID y dime si la carpeta está en “Mi unidad” o en una unidad compartida. No cambies el uso compartido a “cualquier persona”.
3. **Confirma el proyecto de Google Cloud** del que proceden las credenciales OAuth que ya subiste. En ese proyecto, habilita **Google Drive API**. [Guía oficial para habilitar APIs](https://developers.google.com/workspace/guides/enable-apis).

## Paso 2: OAuth en Google Cloud

Haz esto en el mismo proyecto de Cloud:

1. Abre **Google Auth Platform** y completa **Branding** con el nombre de la invitación y un correo de contacto.
2. Revisa **Audience**. Si la cuenta es Gmail personal, la audiencia normalmente será externa; agrega la cuenta propietaria de la carpeta como usuario de prueba si el proyecto está en modo de pruebas.
3. Mantén la aplicación en pruebas por ahora. Cuando el código esté listo, te indicaré el permiso exacto que usará y si hace falta cambiar el estado de publicación. No añadas permisos ni publiques la aplicación antes de esa revisión.
4. No crees ni compartas una clave de cuenta de servicio. Para esta carpeta usaremos la autorización OAuth de la cuenta propietaria.

Google requiere acceso sin conexión para que el servidor pueda renovar la autorización cuando la cuenta no esté abierta. En modo de pruebas, un token OAuth de Drive puede caducar a los siete días; lo revisaremos antes de activar las cargas para invitados. [OAuth de servidor](https://developers.google.com/identity/protocols/oauth2/web-server) · [Caducidad del token en modo de pruebas](https://developers.google.com/identity/protocols/oauth2#expiration).

## Paso 3: autorización y secretos, cuando te lo indique

Después de implementar el flujo en el proyecto:

1. Abre el enlace de autorización que te proporcionaré e inicia sesión con la cuenta dueña de la carpeta.
2. Revisa el permiso solicitado y apruébalo. El flujo guardará la autorización necesaria para que el servidor suba archivos a Drive.
3. No pegues el token resultante en el chat ni lo guardes en un archivo que se suba a GitHub. Si el flujo requiere que lo configures manualmente, te daré los nombres exactos de las variables y el procedimiento.
4. En Vercel, abre el proyecto de la invitación y ve a **Settings → Environment Variables**. Añade allí los secretos que te indicaré, al menos para **Preview** y **Production**. Los valores deben quedar disponibles solo para el servidor; nunca deben empezar con `VITE_`.
5. Guarda los cambios y despliega una nueva preview para que Vercel cargue las variables. [Documentación de variables de entorno de Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables).

Las cargas grandes usarán el mecanismo reanudable de Drive para tolerar interrupciones de red y evitar enviar videos de cientos de MB en una sola petición al servidor. [Cargas reanudables de Drive](https://developers.google.com/workspace/drive/api/guides/manage-uploads).

## Paso 4: dos decisiones operativas antes de activar

- **Quién puede subir:** elige entre (a) cualquier persona con el enlace/QR de la invitación, o (b) personas que además tengan un código de carga. La galería conservará su enlace secreto por separado.
- **Cuándo borrar:** confirma si los 90 días se cuentan desde cada carga o desde una fecha fija posterior al evento. La limpieza automática debe aplicar exactamente esa regla.

## Paso 5: revisión contigo en la preview

Cuando te comparta la preview, necesitaremos probar desde un teléfono:

1. Subir una foto y comprobar que aparece en la carpeta correcta y en la galería privada.
2. Probar un video y una interrupción de red para confirmar que la carga se reanuda y muestra su estado real.
3. Abrir la galería con el enlace secreto y confirmar que la carpeta no se hizo pública.
4. Confirmar el cierre de cargas y la regla de eliminación programada.

## Referencias

- [Habilitar APIs de Google Workspace](https://developers.google.com/workspace/guides/enable-apis)
- [OAuth 2.0 para aplicaciones de servidor](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Caducidad de tokens OAuth en pruebas](https://developers.google.com/identity/protocols/oauth2#expiration)
- [Cargas reanudables de Google Drive](https://developers.google.com/workspace/drive/api/guides/manage-uploads)
- [Variables de entorno en Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables)
