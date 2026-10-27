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
- La flor plana no permite apertura real de pétalos separados; esta entrega usa luz y escala. Hero provisional y textos nuevos pendientes de aprobación visual/familiar.
