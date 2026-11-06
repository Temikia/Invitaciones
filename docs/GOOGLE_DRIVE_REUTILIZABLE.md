# Google Drive con OAuth y Picker: método reutilizable

Validado en Invitaciones el 6 de noviembre de 2026. Esta guía explica el patrón y sus límites para adaptarlo a otro proyecto. La configuración del evento está en [PASOS_GOOGLE_DRIVE.md](PASOS_GOOGLE_DRIVE.md); el estado pendiente, en [EN_CURSO.md](EN_CURSO.md).

## Qué quedó comprobado

La cuenta propietaria completó OAuth, abrió Google Picker, seleccionó la carpeta esperada y recibió la confirmación de que estaba en **Mi unidad** y de que el token se había guardado en `.env`. La confirmación provino de la pantalla real compartida por la usuaria; no se imprimió el token para verificarlo.

La solución del error de Picker está en el commit `c1efc0c`; la confirmación funcional, en `87f8894`. El build, las 19 pruebas existentes y la sintaxis del script pasaron durante la corrección. Esas pruebas no sustituyen una comprobación real de OAuth, renovación del token o transferencia a Drive.

Todavía no se han validado cargas de invitados en Preview, CORS con fotos/videos, reanudación real, inspección de contenido, galería privada ni borrado programado. La autorización local exitosa no acredita esas funciones.

## Arquitectura y responsabilidades

```text
Preparación (cuenta propietaria, en su equipo)
Google Cloud → cliente OAuth + clave de Picker restringida
Script local → consentimiento → callback local → intercambio del código
            → identidad de la cuenta → Picker → selección explícita
            → consulta y validación de carpeta → guardar refresh token local

Aplicación (fase de servidor y despliegue)
Servidor → refresh token → access token temporal → iniciar carga reanudable
Navegador invitado → URL de sesión reanudable → transferir bytes a Drive
```

El consentimiento de la propietaria prepara el acceso del servidor. Los invitados no reciben su refresh token ni su secreto OAuth. El autorizador local sí entrega al navegador de configuración un access token temporal y la clave de Picker para abrir el selector; cerrar esa página al terminar. No convertir esta pantalla de preparación en una ruta pública del sitio.

El conector personal de Drive de Codex no es el backend de los invitados. Tampoco se necesita hacer pública la carpeta. Elegir `drive.file` permite trabajar con los archivos que la aplicación crea o que la persona selecciona expresamente. Seleccionar una carpeta no debe interpretarse como permiso general sobre todos sus archivos preexistentes; comprobar cada caso de uso. [Permisos de Drive](https://developers.google.com/workspace/drive/api/guides/api-specific-auth).

## Componentes que sirven de referencia

| Archivo | Función y alcance |
| --- | --- |
| `scripts/authorize-drive.mjs` | Herramienta local de un solo proceso para autorizar cuenta y carpeta; no es un servicio OAuth público preparado para múltiples usuarios. |
| `api/drive/session.js` | Inicia la carga reanudable con credenciales del servidor; exige habilitación explícita. |
| `api/drive/cleanup.js` | Limpieza limitada por carpeta y marcador de la app; revisar fechas y selección antes de reutilizar. |
| `src/app/Memories.tsx` | Cliente de carga por bloques, progreso y consulta de estado tras interrupciones; pendiente validación real en Preview. |

Antes de portar, revisar la implementación vigente con `rg "resumable|refresh_token|appProperties" api src scripts`. No copiar únicamente el script de OAuth y asumir que existe una integración de cargas completa.

## Credenciales: qué es cada cosa

| Nombre del proyecto actual | Uso | Dónde debe estar |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | Identifica el cliente OAuth; no es una contraseña. | Autorizador y servidor; puede formar parte del enlace OAuth. |
| `GOOGLE_SECRET` | Secreto del cliente OAuth web usado en el intercambio y renovación. | `.env` privado y configuración del servidor. |
| `GOOGLE_PICKER_API_KEY` | Clave estándar de API para Picker, restringida por API y sitios web. | Configuración local; el navegador de preparación la recibe por diseño. |
| `GOOGLE_REFRESH_TOKEN` | Autorización persistente de la cuenta para obtener access tokens temporales. | Solo almacenamiento privado y servidor. |
| `DRIVE_FOLDER_ID` | Carpeta destino comprobada; no es un control de acceso. | Configuración local y servidor. |
| `CRON_SECRET` | Protege el endpoint de limpieza de este proyecto. | Solo servidor. |
| `DRIVE_UPLOADS_ENABLED` | Interruptor operativo, no una credencial ni protección contra abuso. | Servidor; mantener desactivado hasta completar validación. |

No usar prefijo `VITE_` para credenciales del servidor, ni incluirlas en repositorio, logs, capturas o paquetes del frontend. La clave estándar de Picker se usa desde JavaScript y no equivale al secreto OAuth; conservar sus restricciones y evitar difundirla. No extrapolar esto a claves vinculadas a cuentas de servicio ni a claves de otros productos. [Tipos y restricciones de API keys](https://docs.cloud.google.com/docs/authentication/api-keys).

El código de autorización en la URL del callback también es sensible: es temporal, se intercambia una sola vez y no es el refresh token. Un callback que contiene `code` acredita un avance del flujo, pero no demuestra que Picker o el guardado hayan terminado. Nunca compartir la URL completa del callback ni un HAR sin limpiar.

## Preparación en Google Cloud

1. Elegir el proyecto de Cloud que administrará la integración y habilitar **Google Drive API** y **Google Picker API** en él.
2. Configurar marca, audiencia y cuenta de prueba. Para una cuenta Gmail personal, revisar audiencia externa; mantener el modo de pruebas durante la preparación.
3. Crear un cliente OAuth de tipo **Aplicación web** para este flujo. La configuración actual usa origen JavaScript `http://127.0.0.1:8788` y redirect URI exacto `http://127.0.0.1:8788/oauth2callback`.
4. Crear una clave estándar de API para Picker con restricción de sitios web: `http://127.0.0.1:8788/*` y `https://docs.google.com/*`. Permitir **Google Picker API**; añadir Drive API si también se usa esa clave para solicitudes directas a Drive. El backend actual llama a Drive con OAuth, sin enviar la clave de Picker.
5. Guardar las variables localmente y comprobar que `.env` esté ignorado por Git, sin mostrar su contenido. Cambiar una clave en Cloud no cambia `.env`; las variables de un proceso ya iniciado tampoco se recargan automáticamente.

Un puerto distinto exige actualizar conjuntamente el servidor local, el origen de Picker, el origen JavaScript, el redirect URI y las restricciones de la clave. `localhost` y `127.0.0.1` no deben mezclarse por comodidad: mantener un origen coherente. [Configuración oficial de Picker](https://developers.google.com/workspace/drive/picker/guides/web-picker).

## Contrato del autorizador local

- Escuchar únicamente en `127.0.0.1`; generar `state` aleatorio y validarlo antes del intercambio.
- Solicitar `drive.file`, `openid` y `email`, con `access_type=offline` y consentimiento explícito. Verificar que la respuesta incluya refresh token antes de continuar.
- Consultar la identidad y comprobar correo esperado y correo verificado.
- Mostrar Picker con `setDeveloperKey`, `setOAuthToken`, `setAppId` y `setOrigin`. El App ID es el número del proyecto de Cloud; revisar la correspondencia al cambiar de cliente.
- Validar el ID seleccionado en el navegador **y nuevamente en el servidor**; verificar nombre y tipo carpeta mediante Drive.
- Consultar si pertenece a Mi unidad o a unidad compartida. El código actual exige `canDeleteChildren` en unidad compartida porque contempla retención con borrado; comprobar permisos efectivos según el proyecto.
- Guardar `GOOGLE_REFRESH_TOKEN` y `DRIVE_FOLDER_ID` solo después de las validaciones. Borrar las referencias a los tokens pendientes en memoria al completar el guardado. El script conserva el access token en la página hasta cerrarla.
- Mantener `Cache-Control: no-store`, una CSP compatible con Google y `Referrer-Policy: origin`. Esta última envía el origen sin incluir ruta ni query OAuth. `setOrigin` no reemplaza el encabezado HTTP `Referer`.

La combinación de `Referrer-Policy: origin` y `setOrigin(LOCAL_ORIGIN)` es la configuración comprobada. Un endurecimiento posterior de CSP, proxies o políticas de referente requiere repetir la prueba real de Picker con la clave restringida.

## Ejecutar y reconocer éxito

Desde la raíz del repositorio, con Node 24 y la configuración privada disponible:

```powershell
npm run drive:authorize
```

Mantener la terminal abierta, abrir el enlace de esa ejecución, consentir con la cuenta propietaria, pulsar **Seleccionar carpeta** y elegir la carpeta esperada. Éxito significa recibir la confirmación de carpeta verificada y token guardado; no basta con regresar desde Google. Cerrar el proceso con `Ctrl+C` y la página local al terminar.

No recargar el callback para reutilizar el mismo código. Si se reinicia el proceso o falla el intercambio de código, usar una autorización nueva con su nuevo `state`. Si aparece `EADDRINUSE`, identificar el proceso que ocupa el puerto; no cerrar todos los procesos de Node.

Para automatización local en Windows, la sesión usó `Start-Process` con `-WindowStyle Hidden`, directorio de trabajo explícito y `-RedirectStandardOutput`/`-RedirectStandardError`. Permite que el enlace llegue a un archivo mientras el proceso continúa. El intento anterior de redirigir a través de la sesión de PowerShell dejó el log vacío; no asumir que ejecutar el comando basta: comprobar tamaño, presencia del enlace y respuesta del servidor.

El directorio temporal del entorno aislado de Codex y el de Windows real pueden ser distintos. Usar la ruta absoluta verificada en el contexto que lanzó el proceso, en lugar de asumir que `$env:TEMP` apunta al mismo sitio. Para leer un archivo abierto por el proceso, usar un lector que permita compartir lectura/escritura. Los logs contienen el enlace OAuth y son material temporal privado; no guardarlos en Git.

## Incidente resuelto: “The API developer key is invalid”

| Evidencia | Conclusión permitida |
| --- | --- |
| Error inicial genérico 403 de Google | No se aisló una causa propia para esa primera pantalla. No diagnosticar permisos a partir de ese texto solamente. |
| Error posterior explícito de developer key dentro de Picker | El flujo alcanzó el selector; había que comprobar su clave, restricciones y solicitudes. |
| Revisión de Cloud en Chrome | Ambas APIs y ambos referentes estaban configurados correctamente al realizar la revisión final. |
| Código local con `Referrer-Policy: no-referrer` | El autorizador suprimía el referente que requiere la validación por sitio web. |
| Cambio a `origin` más origen explícito de Picker | El servidor devolvió la nueva política; después la usuaria pudo seleccionar y guardar la carpeta. |

La causa identificada fue la incompatibilidad entre la política de referente del autorizador y la clave restringida. La corrección incluyó dos cambios en el mismo commit; no se hizo una prueba A/B que midiera por separado el efecto de `setOrigin`. Conservar ambos como configuración validada, sin atribuir al segundo una demostración aislada.

Las primeras hipótesis de clave vieja, API ausente o proceso antiguo no explicaron el fallo final y provocaron pasos innecesarios. Una tabla que dice “1 API” no identifica cuál está permitida; abrir el detalle antes de concluir que falta Picker. Tampoco recomendar crear claves repetidamente cuando puede medirse el referente real.

## Diagnóstico para la próxima vez

1. Determinar la etapa: consentimiento, callback, intercambio, identidad, Picker, consulta de carpeta o escritura local. Registrar etapa y mensaje sin tokens.
2. Confirmar proyecto, API habilitada y APIs permitidas de la clave. Son configuraciones diferentes. Revisar las URLs de referentes completas en el detalle de la clave.
3. Confirmar configuración cargada y proceso activo sin imprimir valores. Considerar variables heredadas del sistema y reiniciar después de actualizar `.env`.
4. Revisar la petición fallida en DevTools: host, estado HTTP y código de error saneado. Comprobar `Referer` y `Referrer-Policy`; no copiar URL, headers completos o capturas con access token, developer key o código OAuth.
5. Revisar bloqueos de CSP y coherencia de origen/App ID. Cambiar una variable por intento y registrar resultado; esperar la propagación que indique Cloud tras guardar restricciones.
6. Corregir el código o configuración y repetir la selección real. Mantener las restricciones de la clave como resultado final; una prueba temporal sin restricciones no acredita la configuración restringida.

## Portar a otro proyecto

| Adaptar | Dónde revisar |
| --- | --- |
| Cuenta, ID y nombre de carpeta | `EXPECTED_EMAIL`, `EXPECTED_FOLDER_ID`, textos de Picker y validación del nombre en `/save`. El nombre está repetido; no cambiar solo las constantes. |
| Origen y puerto local | `REDIRECT_URI`, `LOCAL_ORIGIN`, `server.listen`, ajustes OAuth y referentes de la clave. |
| Proyecto y credenciales | Nuevo cliente OAuth, clave estándar restringida y nueva autorización de la cuenta. Nunca copiar tokens de Camila. |
| Flujo y permisos | Justificación de scopes, ubicación de carpeta, roles reales, error handling y renovación. Preferir bibliotecas OAuth mantenidas al convertirlo en servicio. |
| Marcador y retención | Sustituir `camilaMemoryUpload` tanto al crear como al consultar para borrar; adaptar carpeta, fechas, zona horaria, cron y autorización. |
| Política de producto | Límites, cierre de cargas, acceso, protección contra abuso, galería y consentimiento de usuarios. |
| Servidor local | Revisar límites del body, validación de host/origin en rutas de escritura, tiempos de espera, concurrencia y cierre. Este script local no implementa todos esos controles de un servicio público. |

Crear una autorización independiente por proyecto. No se ha replicado esta integración en ningún otro repositorio; este documento es el material de reutilización, no evidencia de que otros proyectos estén configurados.

## Paso a producción y mantenimiento

Para una app externa en estado **Testing**, un refresh token con scopes de Drive caduca normalmente a los siete días; las excepciones de scopes básicos de identidad no cubren `drive.file`. Planificar el estado de publicación, los requisitos de verificación aplicables y una autorización vigente antes del evento. Publicar o cambiar estado no debe darse por suficiente para convertir un token de pruebas ya emitido en duradero: validar o reautorizar y probar renovación. [Caducidad de tokens](https://developers.google.com/identity/protocols/oauth2#expiration).

Un refresh token también puede revocarse o invalidarse por otros motivos; implementar diagnóstico y recuperación sin imprimirlo. No prometer autorización permanente. Si se migra el cliente o el proyecto, repetir el consentimiento y validar carpeta.

Antes de activar invitados: protección contra abuso, límites efectivos, disponibilidad/espacio de Drive, renovación real, cargas completas y reanudación desde móvil, CORS, contenido real frente a MIME/extensión, privacidad de la consulta y prueba controlada de eliminación. Una URL de sesión reanudable también habilita operaciones: tratarla como dato sensible temporal.

Los videos grandes se transfieren directamente a Drive; el backend inicia la sesión y no inspecciona todos sus bytes. Diseñar una validación posterior o una arquitectura de inspección adecuada antes de declarar el contenido validado. [Cargas reanudables](https://developers.google.com/workspace/drive/api/guides/manage-uploads).

El borrado necesita una prueba independiente y autorización de cron, además de una selección por carpeta y marcador de la app. No copiar fechas ni una expresión de consulta de este evento sin revisar qué archivos podría alcanzar. Push y despliegue requieren la autorización del usuario.

## Referencias y alcance temporal

Fuentes oficiales consultadas el 06/11/2026. Revisarlas al portar, porque Google puede cambiar requisitos y consola:

- [Picker para aplicaciones web](https://developers.google.com/workspace/drive/picker/guides/web-picker): claves, APIs, referentes, tokens y App ID.
- [OAuth para servidor web](https://developers.google.com/identity/protocols/oauth2/web-server): consentimiento, callback, intercambio y acceso sin conexión.
- [Gestión de claves](https://docs.cloud.google.com/docs/authentication/api-keys): tipos y restricciones.
- [Scopes de Drive](https://developers.google.com/workspace/drive/api/guides/api-specific-auth): acceso limitado con `drive.file`.
- [OAuth y caducidad](https://developers.google.com/identity/protocols/oauth2#expiration): vigencia y motivos de invalidación.

Las observaciones del incidente y los comandos de Windows proceden de esta sesión; no son garantías universales de Google ni una auditoría completa de seguridad.
