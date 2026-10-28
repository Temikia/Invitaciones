# Bitácora — semana del 26 de octubre al 1 de noviembre de 2026

## 2026-10-27 19:22 — Ciudad de México (GMT−6)

El usuario confirmó que los efectos funcionan y pidió dejarlos fijos en Completo. Se eliminaron el selector de ambiente, su contexto, preferencias guardadas, estilos de modos alternativos y las tres pruebas de esa lógica retirada. La galería conserva secuencia cada 3 segundos y navegación, sin botón de pausa/reanudación; se mantiene la pausa automática por foco, visibilidad y pestaña.

La marca C · XV pasó de ornamento inicial a cabecera semántica fija de 44 px más safe-area. Al salir el inicio de vista adopta un fondo de cristal casi transparente, blur de 16 px y borde fino. El audio mantiene un único elemento, sin autoplay; el botón se traslada visualmente a un portal fijo abajo a la derecha al salir el original por arriba, conserva foco/reproducción y vuelve inline al regresar. Se oculta desde el lago para preservar el cierre sin controles. Los saltos rápidos de scroll se miden una vez por frame para evitar estados obsoletos de IntersectionObserver.

Build y 19 pruebas correctos. Revisión independiente sin bloqueantes y navegador sobre producción local: móvil/escritorio sin desbordamiento, header fijo y glass, Completo con SO reducido y preferencia antigua paused, audio real continuo de 1.05 a 3.07 s con un solo elemento, pausa desde flotante, devolución del foco inline, galería automática y saltos inicio/retrato/lago/música. Capturas en .qa ignorada; originales intactos. Sin push ni despliegue.

## 2026-10-27 19:04 — Ciudad de México (GMT−6)

El usuario rechazó que los invitados debieran modificar ajustes del teléfono para ver efectos. Se sustituyó la desactivación total por tres ambientes coordinados en React, GSAP y CSS. Movimiento reducido selecciona automáticamente Suave: pulsos lentos de luz, desvanecimientos y galería con fundidos, sin paralaje, desplazamientos ni zoom. Completo conserva la experiencia original y Sin efectos detiene las animaciones con contenido legible.

Se añadió un selector junto a la música, con elección persistente que prevalece sobre el sistema y funciona durante la visita aunque falle localStorage. La galería avanza cada 3 s en Completo y 6 s en Suave; puede pausarse y mantiene pausa por foco, visibilidad de escena y pestaña. Se eliminó la dependencia directa del SO en CSS y GSAP; no se cambió Vite ni el stack.

Build y 22 pruebas correctos, incluida resolución de preferencias y elección explícita sobre el SO. Revisión independiente corrigió selectores de pseudo-elementos y no encontró bloqueantes. Navegador y build de producción local en móvil/escritorio, SO reducido: luz suave medida, elección Completo activa efectos y persiste, Sin efectos da cero animaciones y ningún contenido oculto; avance suave y pausa comprobados. Capturas ignoradas en .qa. Sin push ni despliegue; pendiente publicar con autorización y revisar Android físico.

## 2026-10-27 18:58 — Ciudad de México (GMT−6)

Se añadieron `_55A1171_(2)` y `_55A1286_(2)` de Fotos XV Pri como capítulos VI «El encanto» y VII «El comienzo». Se generaron derivados WebP orientados y sin metadatos, conservando originales, y se incluyeron sus rutas en el script. La baraja circular antes asumía cinco elementos; ahora mantiene vecinos y oculta los adicionales para recorrer siete fotografías por controles y teclado.

Se investigó la ausencia de efectos en Android/Chrome. La URL pública de Vercel muestra 52 animaciones CSS y partículas en movimiento; al emular `prefers-reduced-motion: reduce`, las animaciones CSS bajan a cero y se desactivan GSAP y autoplay por las reglas existentes. Vite no explica el problema. Se indicó revisar «Quitar animaciones» en Android; falta medir la preferencia efectiva del teléfono del usuario. Se conserva la accesibilidad.

Build y 19 pruebas correctos, incluida regresión de cinco a siete tarjetas. Revisión independiente sin hallazgos; navegador móvil/escritorio con fotos nuevas, siete imágenes cargadas, regreso circular, tres tarjetas accesibles, sin desbordamiento, movimiento reducido y autoplay 07 → 01 tras 3300 ms. Sin push ni despliegue.

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

## 2026-10-27 18:49 ? Ciudad de M?xico (GMT?6)

Se reemplaz? la secci?n de confirmaci?n por solo la tarjeta premium del recurso local solicitado: papel claro, filigranas, sello, elecci?n de asistencia, nombre, contador, nota opcional y pase simb?lico. Se eliminaron los textos externos de la secci?n anterior. El original permanece intacto y los estilos quedan aislados para proteger el resto de la invitaci?n.

Se conserva el WhatsApp configurado y la ausencia de m?ximo de invitados. El formulario valida y prepara una vista previa en un di?logo nativo, con copia y enlace a WhatsApp; no presenta la respuesta como enviada. Escape, foco, nota fuera del teclado cuando est? cerrada y movimiento reducido contemplados. Build y 16 pruebas correctos; revisi?n independiente sin bloqueantes y comprobaci?n en Chromium escritorio/m?vil sin desbordamiento, respuestas afirmativa/negativa y movimiento reducido. Sin push ni despliegue.
