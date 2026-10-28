# Verificación de la primera versión

## Cabecera fija, Completo y música flotante — 27/10/2026 19:22 (GMT−6)

Historia: efectos completos sin selector; cabecera fina que permanece arriba y adopta cristal al desplazarse; botón de música que acompaña al invitado cuando el original sale de vista, conservando la canción.

- Build TypeScript/Vite y 19 pruebas correctos. Retiradas las tres pruebas del selector eliminado. Revisión independiente sin bloqueantes de efectos, header, galería, portal de audio, foco y limpieza de listeners/observers/rAF.
- Producción local mediante vite preview. Chromium 390 × 844 con reduce=true y localStorage camila-motion=paused: data-motion full y partículas float-up; ningún selector de ambiente ni gallery-playback.
- Header semántico HEADER, 44 px en las vistas probadas, top 0 durante el recorrido. Transparente en inicio; al desplazarse class is-scrolled y backdrop-filter blur(16px) saturate(1.45). Sin desbordamiento a 390 y 1440 px.
- Reproducción real iniciada mediante clic: tiempo 1.05 s inline → 3.07 s flotante, playing=true, misma identidad de HTMLAudioElement y exactamente un audio. Botón flotante 60 × 60 px, right 374 y bottom 828 en viewport 390 × 844, a 16 px de los bordes. Foco transferido al botón flotante; inline aria-hidden true y sin tabulación.
- Pausa desde flotante y regreso al original: mismo audio y tiempo conservado, foco inline, visibilidad visible y sin portal. Botón de audio fuera de GSAP para evitar desvanecerse antes de la transición geométrica.
- Regresión corregida: un salto lago → inicio podía mantener un estado obsoleto porque ambos nodos seguían fuera de intersección. Ahora la medición agrupada por rAF da: inicio sin flotante ni glass → retrato con ambos → lago sin flotante → inicio sin ambos → retrato con ambos → música inline con glass.
- Galería avanza 01 → 02 tras 3300 ms con modo Completo y sin botón pausa/reanudación. Se mantienen siete fotos y 19 escenas. Sin errores de aplicación registrados. Capturas locales .qa/header-top-mobile.png, .qa/header-audio-mobile.png y .qa/header-audio-desktop.png.
- Sin push ni despliegue; queda revisar la publicación en Android físico cuando se autorice publicar.

## Ambientes sin cambiar ajustes del teléfono — 27/10/2026 19:04 (GMT−6)

Sustituye la política anterior de desactivar todos los efectos al detectar movimiento reducido. Historia: incluso con esa preferencia activa, el invitado ve luz y fundidos automáticamente y puede elegir la experiencia completa dentro de la página, sin cambiar Android.

- Build correcto y 22 pruebas. Pruebas de preferencia inicial, elección explícita Completo/Suave/Sin efectos y descarte de valores inválidos. Revisión independiente de React y CSS sin bloqueantes.
- Chromium móvil 390 × 844 con `reduce=true` y sin elección guardada: modo gentle, partículas `atmosphere-glow`, opacidad 0.116 → 0.139 tras 900 ms y transform none. 45 animaciones CSS medidas tras implementar la luz suave; documento de 390 px sin desbordamiento.
- Con el mismo SO reducido, elegir Completo produce `float-up` y 71 animaciones CSS medidas; recargar conserva modo full y localStorage full. Son mediciones durante esa visita, no un número fijo de efectos.
- Sin efectos: cero animaciones CSS y cero elementos data-reveal con opacidad cero tras cambiar desde Completo. La reversión del contexto GSAP limpia los estados anteriores.
- Galería Suave: 01 → 02 después de 6400 ms, una tarjeta visible y una accesible; transform de centrado sin escala ni rotación. Pausar galería muestra Reanudar galería y mantiene el mismo capítulo tras 6400 ms. En Sin efectos la navegación es manual.
- Build de producción servido mediante vite preview, móvil/escritorio: modo gentle automático con reduce=true, pseudo-elementos de flor y marco con gentle-glow y 19 escenas conservadas. Capturas en .qa/motion-controls-mobile.png y .qa/motion-gentle-desktop.png. Sin errores de aplicación registrados.
- No se publicó ni se comprobó en un Android físico. La versión pública seguirá con la política anterior hasta el siguiente despliegue autorizado.

## Ampliación de galería y diagnóstico Android — 27/10/2026 18:58 (GMT−6)

Historia: recorrer las siete fotografías, incluidas las dos nuevas de Fotos XV Pri, y distinguir un fallo de despliegue de la preferencia de movimiento del dispositivo.

- Build correcto y 19 pruebas. Regresión de estados de la baraja circular para cinco/siete fotos, vecinos al cruzar el inicio y tres tarjetas principales accesibles. Revisión independiente sin hallazgos.
- Chromium móvil 390 × 844: siete imágenes decodificadas, ciclo 01 → 07 → 01, tres tarjetas accesibles en cada paso y documento de 390 px sin desbordamiento. Escritorio 1440 × 1000, sin desbordamiento. Capturas en `.qa/`, ignoradas.
- Con movimiento normal y galería visible, autoplay 07 → 01 después de 3300 ms; fuera de pantalla se pausa. Con movimiento reducido se conserva navegación manual y no se fuerzan animaciones.
- Producción `https://mis-xv-camila.vercel.app/`: viewport de 390 px, `reduce=false`, 52 animaciones CSS y partículas `float-up` con transform distinto después de 600 ms. Emulación `reduce=true`: cero animaciones CSS y `animationName=none`. GSAP y autoplay también condicionados por esa preferencia en código.
- Android/Chrome del usuario: síntoma compatible con «Quitar animaciones», pendiente de confirmar en el teléfono. La emulación de escritorio no sustituye comprobar su ajuste real. Vite no es causa de la desactivación observada. Fuentes: [Google sobre movimiento reducido](https://web.dev/articles/prefers-reduced-motion), [Vite en Vercel](https://vercel.com/docs/frameworks/frontend/vite).
- Sin envío de datos, push ni despliegue. Originales intactos.

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

## Tarjeta RSVP ? 2026-10-27 18:49 (GMT?6)

Historia: el invitado selecciona asistencia, escribe su nombre y prepara el mensaje; revisa el texto y abre el enlace al WhatsApp configurado para enviarlo manualmente. Flujo est?tico sin backend ni nuevas variables de entorno.

- Build TypeScript/Vite y 16 pruebas existentes correctos. Revisi?n independiente de React, validaci?n y aislamiento CSS sin bloqueantes.
- Chromium: escritorio 1440 ? 1100 y m?vil 390 ? 844; tarjeta revisada visualmente, 19 escenas conservadas y ancho de documento m?vil de 390 px.
- Nombre vac?o muestra error y recibe el foco. Mar?a Jos? & familia, dos asistentes y nota con acentos generan un ?nico par?metro text y destino wa.me/17202369330.
- Respuesta negativa oculta el contador y genera agradecimiento sin afirmar asistencia. Di?logo nativo abre con foco en cerrar; Escape lo cierra y restaura el foco. No se env?an mensajes reales.
- Movimiento reducido: preferencia activa, tarjeta con opacidad 1 y animationName none; sin desbordamiento m?vil.
- Original HTML conservado. No se verific? env?o externo ni tel?fonos f?sicos.
