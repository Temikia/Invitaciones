# Verificación de la primera versión

27 de octubre de 2026. Historia: el invitado recorre 19 escenas, elige escuchar música, consulta fecha/lugar, explora fotografías y prepara su confirmación en WhatsApp. Los recuerdos tienen una página independiente cuyo almacenamiento aún no está conectado.

## Comprobado
- Build de producción con TypeScript y Vite 8.
- Ocho pruebas Vitest: instante de Denver, contador antes/después, calendario, WhatsApp con acentos/caracteres de URL, nombre/cantidad y validación de archivos.
- Auditoría de instalación tras actualización: cero vulnerabilidades reportadas.
- Navegador Chromium, 390 × 844 y 1440 × 1000: sin desbordamiento horizontal; 19 escenas en orden; última escena 19; sin imágenes rotas detectadas ni errores de aplicación en consola.
- Galería al extremo final: indicador 05/05 y botón siguiente deshabilitado en ambos tamaños.
- Lago móvil: capa de lámparas con la misma altura que la escena (802 px), reflejos anclados al lago.
- Audio inicialmente detenido y sin datos descargados (`paused=true`, `readyState=0`); después de interacción `paused=false`, sin error. Pausa también accionada en navegador.
- RSVP con nombre de prueba María José y tres asistentes: URL capturada a `wa.me/17202369330`, texto correcto y acentos codificados. No se envió mensaje. Enlace de respaldo por si se bloquea la ventana emergente.
- Movimiento reducido: cero elementos de revelado ocultos, cero animaciones activas, audio detenido, sin desbordamiento.
- `/recuerdos` abre directamente. Selección de una foto WebP comprobada; interfaz conserva advertencia de que todavía no hay envío.
- SHA256 antes/después de preparar recursos: originales intactos; hero se conserva al repetir script.
- Comprobación local de secretos: 62 archivos de aplicación, documentación, recursos y build sin valores de credenciales del entorno. `.env`, capturas y originales excluidos de Git.
- Fondos forest/lake generados con Google y revisados visualmente. Capturas locales temporales en `.qa/`, excluidas del repositorio.

## Límites de esta entrega
- Falta revisión sobre dominio real y teléfonos físicos/iOS, incluyendo gesto de swipe y apertura de WhatsApp/Maps en aplicaciones nativas.
- Maps usa exactamente el enlace entregado; no se verificó la ruta de navegación real.
- QR tiene la misma URL de destino que el botón y usa el origen actual; falta escaneo físico del dominio definitivo antes de imprimir.
- La selección de archivos no equivale a carga. Backend, progreso, reanudación, almacenamiento Drive y borrado por retención siguen pendientes.
- No se ha medido Lighthouse ni hecho una prueba en red móvil lenta.
- La flor plana no permite apertura real de pétalos separados; esta entrega usa luz y escala. Los textos nuevos están pendientes de aprobación visual/familiar.

## Mejora visual — 27/10/2026

- Hero sustituido por `principal.jpg` mediante el preparador existente, conservando ruta y dimensiones. Encuadre revisado en escritorio.
- Espacios reducidos entre escenas; apertura sin altura mínima de pantalla completa. Se mantiene la secuencia de 19 escenas.
- Capa global fija con 26 partículas y 12 lámparas, sin capturar eventos, debajo del contenido. El centro tiene menor intensidad. Scroll actualiza variables CSS mediante RAF, sin renders React, y ResizeObserver recalcula ante cambios de altura.
- Móvil 390 × 844: ancho de documento 390, 19 escenas, ninguna imagen rota, audio detenido. Opacidades de partículas/lámparas al 50%, 60%, 66.67%, 75% y 90%: 0.926/0, 0.370/0, ~0/0, 0/0.463 y 0/1. Se mide el centro del viewport respecto de la altura total del documento.
- Escritorio 1440 × 1000: ancho 1440, 19 escenas, ninguna imagen rota; foto revisada visualmente. Lago móvil revisado, sin controles posteriores.
- Movimiento reducido: media query confirmada, cero animaciones activas y cero revelados ocultos; en lago partículas 0 y lámparas 1, ancho 390. Sin errores de aplicación reportados por el navegador.
- Build y ocho pruebas pasan tras detectar cambios simultáneos ajenos. Las capturas finales reflejan la combinación con esos cambios (marcos y animaciones); se conserva su trabajo y se excluye del commit de esta tarea.
- Capturas locales en `.qa/`, ignoradas por Git. Sin push ni despliegue.
- Se exportó el índice preparado a `.qa/staged` para comprobar solo la tarea: build y ocho pruebas correctos también sin los cambios simultáneos.
- En esa copia se corrigió `height: auto` del hero para que el atributo HTML de 1600 no imponga altura fija. Encuadre aislado revisado: imagen 346 × 461 en móvil y 618 × 824 en escritorio, sin desbordamiento y con texto legible.

## Galería narrativa — 27/10/2026 18:28 (GMT−6)

Historia verificada: el invitado descubre las cinco fotografías seleccionadas en una portada editorial, un carrusel narrativo y un diálogo de modo cine, dentro de la escena 10. Esta implementación sustituye la galería horizontal descrita en la verificación inicial.

- Referencia local: `recursos/galeria_camila_carrusel_narrativo.html`; estilos aislados en `src/styles/gallery.css`, contenido de capítulos en `src/config/invitation.ts`. Los originales no se modificaron y no se incorporaron imágenes incrustadas de la referencia.
- Build TypeScript/Vite correcto y 16 pruebas existentes correctas.
- Chromium escritorio 1440 × 1000 y móvil 390 × 844: revisión visual de portada, carrusel y modo cine; 19 escenas conservadas, cinco imágenes cargadas y sin desbordamiento horizontal ni errores de aplicación registrados.
- Secuencia automática: indicador avanzó de 03 a 04 tras 3100 ms. Sin botón de secuencia ni barra «Cinco instantes, una historia». Flechas, miniaturas y Escape disponibles; el diálogo nativo limita el foco y bloquea el scroll del fondo.
- Revisión independiente corrigió remontaje de navegación que perdía el foco, cierre invisible en móvil y cambio automático mientras se interactúa con teclado. Navegación del diálogo comprobada con conservación del foco.
- Movimiento reducido: indicador estable tras 3200 ms y cero animaciones activas en las tarjetas. Navegación manual disponible; la secuencia se pausa también fuera de pantalla y cuando la pestaña está oculta.
- Capturas temporales de navegador fuera del repositorio; sin push ni despliegue. Falta validación en teléfonos físicos, ya indicada en los límites generales.
