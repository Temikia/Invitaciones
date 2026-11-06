# Bitácora — semana del 2 al 8 de noviembre de 2026

## 2026-11-06 14:35 — Ciudad de México (GMT−6)

Se documentaron los pasos necesarios para habilitar la carga de recuerdos y la galería privada con Google Drive. La guía distingue las acciones de configuración de la usuaria de la implementación, y registra las decisiones de enlace secreto, OAuth, seguridad de secretos, despliegue, acceso a cargas, conservación y validación. No se modificó la aplicación ni se expusieron credenciales.

Siguiente paso: la usuaria comparte el ID y ubicación de la carpeta, habilita Drive API y confirma la cuenta de almacenamiento y las decisiones operativas pendientes.

## 2026-11-06 14:19 — Ciudad de México (GMT−6)

Se añadió un selector de idioma **En | Es** con el estilo dorado de la invitación para que cada persona pueda leerla en el idioma que prefiera. El cambio cubre las 19 escenas, la galería, RSVP, accesibilidad y la página `/recuerdos`; la selección se conserva localmente y actualiza el idioma y los metadatos del documento. La fecha y la hora se presentan con el formato del idioma y la zona horaria del evento.

Compilación de producción verificada con `npm.cmd run build`. No se ejecutaron pruebas automatizadas. Sin push ni despliegue.
