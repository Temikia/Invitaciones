# Bitácora — semana del 2 al 8 de noviembre de 2026

## 2026-11-06 15:09 — Ciudad de México (GMT−6)

Se retomó la integración de recuerdos después de que la usuaria confirmó los pasos 1 y 2 de configuración de Google. Se implementó el inicio de sesiones reanudables en Vercel, la transferencia directa por bloques desde el navegador y un flujo local de autorización con `drive.file`, `openid` y `email`; el selector valida la carpeta privada y el permiso de borrado antes de guardar el token en `.env`. El endpoint queda apagado por defecto. También se programó limpieza diaria para borrar únicamente cargas marcadas por la app desde el 7 de marzo de 2027 a las 00:00 Denver, con `CRON_SECRET`. Compilación, 19 pruebas, sintaxis y configuración pasaron. No se solicitó consentimiento OAuth ni se configuraron secretos de Vercel. No se pudo hacer la revisión visual porque el navegador de control no estuvo disponible; la vista web de consulta de la galería sigue pendiente. Commit local: `e42dab9` — «Integra cargas reanudables privadas en recuerdos».

Siguiente paso: terminar revisión del código y documentación y hacer commit. Luego la usuaria habilita Picker, registra el URI localhost y ejecuta `npm run drive:authorize`. Antes de activar cargas: agregar protección contra abuso, confirmar la ubicación y rol de la carpeta, configurar Preview y probar foto/video/reanudación y borrado en entorno controlado.

## 2026-11-06 14:35 — Ciudad de México (GMT−6)

Se documentaron los pasos necesarios para habilitar la carga de recuerdos y la galería privada con Google Drive. La guía distingue las acciones de configuración de la usuaria de la implementación, y registra las decisiones de enlace secreto, OAuth, seguridad de secretos, despliegue, acceso a cargas, conservación y validación. No se modificó la aplicación ni se expusieron credenciales.

Siguiente paso: la usuaria comparte el ID y ubicación de la carpeta, habilita Drive API y confirma la cuenta de almacenamiento y las decisiones operativas pendientes.

## 2026-11-06 14:19 — Ciudad de México (GMT−6)

Se añadió un selector de idioma **En | Es** con el estilo dorado de la invitación para que cada persona pueda leerla en el idioma que prefiera. El cambio cubre las 19 escenas, la galería, RSVP, accesibilidad y la página `/recuerdos`; la selección se conserva localmente y actualiza el idioma y los metadatos del documento. La fecha y la hora se presentan con el formato del idioma y la zona horaria del evento.

Compilación de producción verificada con `npm.cmd run build`. No se ejecutaron pruebas automatizadas. Sin push ni despliegue.
