# Bitácora — semana del 26 de octubre al 1 de noviembre de 2026

## 2026-10-27 15:43 — Ciudad de México (GMT−6)

Se leyó el documento maestro y todo el paquete de definición. Se detectó que el checklist ya contenía datos confirmados que contradecían los pendientes originales; se adoptó esa fuente para evitar inventar información del evento.

Se construyó la primera versión Vite/React/TypeScript con 19 escenas, contenido centralizado, calendario de noviembre, contador con zona Denver, galería, música voluntaria, enlace RSVP por WhatsApp y QR a módulo separado de recuerdos. Se optimizaron fotografías/ornamentos sin alterar originales y se generaron fondos propios mediante Google con clave local protegida. El hero conserva una ruta fija provisional para probar fotos.

Se revisó con subagentes la lógica, los recursos y los fallos visuales. Se corrigieron la selección de la última foto, las capas del lago, la semántica del calendario y el respaldo de apertura de WhatsApp. Se actualizaron dependencias tras auditoría hasta obtener cero vulnerabilidades reportadas.

Se verificaron compilación, ocho pruebas, navegador móvil/escritorio, audio, RSVP sin envío real y movimiento reducido. Se documentaron alcance y limitaciones en `VERIFICACION.md`. Recuerdos queda sin backend real y lo comunica explícitamente; el siguiente trabajo consiste en revisar el preview de Vercel y definir credenciales/carpeta para Google Drive. Usuario autorizó commit y push; despliegue manual a cargo del usuario.

## 2026-10-27 16:10 — Ciudad de México (GMT−6)

A solicitud del usuario se cambió el repositorio de trabajo a `https://github.com/CheshireZol/Invitaciones.git`. Se comprobó que el destino estaba vacío, se actualizó `origin` y se subió `main` conservando el commit inicial y su historial. El repositorio anterior permanece intacto. Se actualizaron README y estado para que las siguientes sesiones usen el destino correcto; queda reconectar Vercel al nuevo repositorio antes del próximo despliegue. Cambio exclusivo de remoto/documentación, sin cambios de aplicación ni necesidad de repetir las pruebas funcionales.
