# Invitación de Camila

## Retomar
Leer primero `docs/EN_CURSO.md`, después `README.md` y la ficha pertinente del paquete de definición. No releer documentos completos sin necesidad.

## Fuentes y estructura
- `Invitacion_Camila_Documento_Maestro.md`: visión original.
- `Invitacion_Camila_Paquete_Definicion/05_CHECKLIST_PRE_DESARROLLO.md`: respuestas vigentes; prevalecen sobre pendientes antiguos.
- `src/config/invitation.ts`: datos, mensajes y rutas centralizados.
- `src/components/scenes/`: componentes independientes de las 19 escenas, agrupados por acto.
- `src/components/ui/`, `src/hooks/`, `src/lib/`: interacciones, animación y lógica.
- `public/assets/production/`: recursos que sí se despliegan.
- `docs/ASSETS.md`, `docs/FONDOS.md`, `docs/DECISIONES.md`: contratos y procedencia.

## Reglas
- Comunicación en español. Bitácora en `docs/BITACORA.md`, fecha/hora GMT−6, solo semana vigente; archivar lo anterior por mes.
- Conservar orden de escenas y secuencia Dios → luz → familia → celebración. No agregar controles después del lago.
- Nunca modificar originales de `multimedia/` y `recursos/`, ni subirlos en bruto. Derivados en `public/assets/production/`.
- `.env` es privado. Nunca imprimir valores ni usar claves con prefijo `VITE_`. La generación de imágenes usa la API Google solo localmente.
- No simular cargas exitosas; Google Drive todavía requiere integración real.
- Mantener acceso sin audio, navegación por teclado y movimiento reducido.
- Al cerrar fase: verificar, actualizar `EN_CURSO.md` y bitácora y hacer commit local en español con solo archivos de la tarea. Push y despliegue cuando el usuario los autorice.

## Verificación
`npm run build` y `npm test`. Para cambios visuales, revisar móvil/escritorio y movimiento reducido. `npm run dev` inicia Vite en localhost. Node 24.x.
