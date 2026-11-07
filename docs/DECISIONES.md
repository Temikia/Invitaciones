# Decisiones de la primera construcción

Fecha: 27 de octubre de 2026.

1. El checklist completado es la fuente vigente ante contradicciones con el documento maestro o la lista antigua de pendientes. Se conserva el paquete original para trazabilidad.
2. Se adopta el stack sugerido: Vite, React, TypeScript, GSAP/ScrollTrigger y CSS. Cada escena es un componente; se agrupan en tres archivos por acto para facilitar mantenimiento.
3. Fecha confirmada: domingo 22 de noviembre de 2026 a las 17:00 en Denver; instante absoluto `2026-11-23T00:00:00Z`. No se usa la zona horaria del dispositivo para calcular el contador.
4. WhatsApp estadounidense: se antepone `1` al número recibido de diez cifras. El formulario prepara un mensaje; el invitado debe enviarlo para confirmar. Sin base de datos ni registro ficticio.
5. Se respeta el pedido de hero provisional pese a existir `principal.jpg`. Tiene dimensiones y nombre fijos para probar distintas fotografías.
6. Textos espiritual, familiar y final redactados para esta versión; quedan sujetos a revisión de la familia. Nombres de padres conservados tal como fueron escritos por el usuario.
7. Itinerario transcrito de `recursos/itinerario.jpeg` y ordenado cronológicamente. Cena 19:30–20:30; pastel 23:30–00:00; cierre 01:30 del lunes 23.
8. Recursos visuales y MP3 entregados por el usuario utilizados según su instrucción expresa del checklist. No se han editado los originales.
9. Fondos originales generados con Google conforme a la solicitud; claves solo en `.env` ignorado. El script conserva fondos existentes para evitar regeneraciones innecesarias.
10. Las escenas se revelan con ScrollTrigger sin secuestrar el scroll. Decisión vigente del usuario (27/10/2026, 19:22): experiencia fija en Completo, sin selector ni lectura de preferencias guardadas o del sistema. Se retiran los modos alternativos y los controles de pausa/reanudación de galería; se conserva la pausa automática por teclado, pestaña y visibilidad. No se exige cambiar ajustes del teléfono. La flor plana usa revelado de luz/escala; no se considera terminada la apertura de pétalos por capas.
11. Módulo de recuerdos desacoplado en `/recuerdos`. Actualización 06/11/2026: sesiones reanudables, desafío Turnstile verificado en servidor, limitación compartida con Redis y álbum privado con cookie firmada implementados. No se publican archivos de Drive. La activación requiere configurar Preview, comprobar vigencia OAuth, bytes/CORS, vídeo con rangos y retención. No se generan éxitos ni progresos falsos.
12. El QR utiliza el origen actual y `/recuerdos`, de modo que cada preview funciona en su propio dominio. Para imprimirlo debe usarse el despliegue definitivo, después de comprobarlo con un teléfono.
13. La autorización posterior del usuario permite commit y push al terminar la fase verificada. No se ejecuta despliegue manual en Vercel desde esta sesión.
14. La marca C · XV es un header semántico fijo de 44 px más safe-area, transparente al inicio y con cristal muy sutil al hacer scroll. La música conserva un único audio sin autoplay; su botón flota abajo a la derecha tras salir el original por arriba, vuelve al regresar y desaparece desde la entrada al lago. No se agregan controles al cierre.

## OAuth y Google Picker — 06/11/2026

- Se elige autorización de la cuenta propietaria con `drive.file`, `openid` y `email`, más selección explícita de carpeta. No se amplía el permiso a todo Drive para evitar el error del selector.
- El autorizador es una herramienta local, enlazada solo a loopback; no debe publicarse como endpoint de consentimiento de invitados. La clave estándar de Picker y un access token temporal llegan a esa pantalla; el refresh token y el secreto OAuth quedan fuera de la aplicación pública.
- La clave de Picker conserva restricciones por API y referentes. El autorizador usa `Referrer-Policy: origin` y origen explícito de Picker. El intento con `no-referrer` suprimía el dato necesario para comprobar la restricción por sitio web; la corrección y su evidencia están en [la guía reutilizable](GOOGLE_DRIVE_REUTILIZABLE.md#incidente-resuelto-the-api-developer-key-is-invalid).
- Autorización local, despliegue y activación de invitados son hitos distintos. El código de protección y galería está listo, pero faltan la configuración de servicios, renovación OAuth comprobada, cargas, CORS y retención en Preview.
- Turnstile se valida server-side antes de crear sesiones, por lote de hasta 20 archivos. Upstash aplica 4 lotes/minuto/IP y 120 solicitudes/minuto/IP a consultas de galería; usa huellas HMAC con caducidad de un minuto, no direcciones IP almacenadas. Si faltan las variables de protección, el módulo no declara las cargas listas.
- El enlace privado coloca el secreto solo en el fragmento de URL y lo canjea por una cookie firmada de 24 horas. Listado y contenido exigen esa cookie y se filtran por carpeta y marcador de la app. Los videos se proxifican con soporte de rangos; evaluar transferencia y límites de funciones en Preview.
- La guía se reutiliza como patrón revisable; no se copian credenciales, nombres del evento, marcadores de borrado ni fechas a otros proyectos.
