# Bitácora — semana del 26 de octubre al 1 de noviembre de 2026

## 2026-10-27 18:12 — Ciudad de México (GMT−6)

Se incorporó `principal.jpg` como hero optimizado, sin cambiar el original ni la ruta pública. Se redujeron paddings y márgenes entre escenas y se eliminó la altura mínima de la apertura para acercar los elementos y dar continuidad al recorrido.

Se sustituyeron efectos locales por una atmósfera global: partículas en los primeros dos tercios, desvanecidas al llegar a ese punto, y lámparas con aparición inversa hacia el cierre. Menor intensidad en el centro, contenido por encima y eventos de puntero deshabilitados; movimiento reducido conserva ornamentos estáticos. Revisión de código delegada sin hallazgos bloqueantes.

Build y ocho pruebas correctos; navegador móvil/escritorio sin desbordamiento ni imágenes rotas, transición medida y movimiento reducido confirmado sin animaciones ni contenido oculto. Se detectaron cambios simultáneos ajenos en marcos, fecha, mensajes y animaciones; se preservan y se separan del commit local de esta tarea. No se ejecuta push ni despliegue.

## 2026-10-27 15:43 — Ciudad de México (GMT−6)

Se leyó el documento maestro y todo el paquete de definición. Se detectó que el checklist ya contenía datos confirmados que contradecían los pendientes originales; se adoptó esa fuente para evitar inventar información del evento.

Se construyó la primera versión Vite/React/TypeScript con 19 escenas, contenido centralizado, calendario de noviembre, contador con zona Denver, galería, música voluntaria, enlace RSVP por WhatsApp y QR a módulo separado de recuerdos. Se optimizaron fotografías/ornamentos sin alterar originales y se generaron fondos propios mediante Google con clave local protegida. El hero conserva una ruta fija provisional para probar fotos.

Se revisó con subagentes la lógica, los recursos y los fallos visuales. Se corrigieron la selección de la última foto, las capas del lago, la semántica del calendario y el respaldo de apertura de WhatsApp. Se actualizaron dependencias tras auditoría hasta obtener cero vulnerabilidades reportadas.

Se verificaron compilación, ocho pruebas, navegador móvil/escritorio, audio, RSVP sin envío real y movimiento reducido. Se documentaron alcance y limitaciones en `VERIFICACION.md`. Recuerdos queda sin backend real y lo comunica explícitamente; el siguiente trabajo consiste en revisar el preview de Vercel y definir credenciales/carpeta para Google Drive. Usuario autorizó commit y push; despliegue manual a cargo del usuario.

## 2026-10-27 16:10 — Ciudad de México (GMT−6)

A solicitud del usuario se cambió el repositorio de trabajo a `https://github.com/CheshireZol/Invitaciones.git`. Se comprobó que el destino estaba vacío, se actualizó `origin` y se subió `main` conservando el commit inicial y su historial. El repositorio anterior permanece intacto. Se actualizaron README y estado para que las siguientes sesiones usen el destino correcto; queda reconectar Vercel al nuevo repositorio antes del próximo despliegue. Cambio exclusivo de remoto/documentación, sin cambios de aplicación ni necesidad de repetir las pruebas funcionales.

## 2026-10-27 18:28 — Ciudad de México (GMT−6)

Se reemplazó la galería horizontal de la escena 10 por la experiencia del segundo acto de `galeria_camila_carrusel_narrativo.html`: portada editorial con fotografías superpuestas, carrusel de cinco capítulos y modo cine. Se adaptaron las cinco fotografías elegidas `gallery-1.webp` a `gallery-5.webp`, con descripciones acordes a cada imagen, sin alterar originales ni el orden de las 19 escenas. Estilos aislados para evitar afectar el resto de la invitación.

A petición del usuario, la secuencia comienza automáticamente y cambia cada tres segundos; se eliminaron el botón de secuencia y la barra «Cinco instantes, una historia». Navegación manual por flechas, teclado, deslizamiento y miniaturas en modo cine. Movimiento reducido desactiva la secuencia y las animaciones; se pausa fuera de pantalla, con pestaña oculta y durante interacción por teclado.

Build y 16 pruebas correctos. Revisión de código delegada y comprobación visual en escritorio/móvil: se corrigieron el foco del diálogo y los controles móviles. Autoplay medido a 3100 ms, movimiento reducido estable a 3200 ms, cinco fotografías cargadas, 19 escenas y sin desbordamiento horizontal. Detalle en `VERIFICACION.md`. Se preservan los ajustes ajenos de tamaño de retratos en `src/styles/invitation.css`, fuera de este commit. Sin push ni despliegue.
