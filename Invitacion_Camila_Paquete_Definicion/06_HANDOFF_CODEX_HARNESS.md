# Handoff técnico para Codex / Harness

## 1. Objetivo de implementación
Construir la primera invitación real de Camila como una experiencia web vertical, mobile-first, cinematográfica y reutilizable. El mockup debe ser evolucionable; no se considera desechable.

## 2. Stack inicial recomendado
- Vite
- React
- TypeScript
- GSAP + ScrollTrigger
- CSS
- Vercel

### Justificación
No se requiere Next.js para la invitación base: no hay autenticación, SSR ni backend complejo en el flujo principal. El módulo de recuerdos se desacopla.

## 3. Arquitectura conceptual
```text
src/
  app/
  components/
    scenes/
      Scene01Flower/
      Scene02Camila/
      ...
      Scene19LanternLake/
    ui/
      AudioControl/
      Gallery/
      RSVPForm/
      UploadCTA/
  config/
    invitation.ts
  content/
  hooks/
  lib/
  styles/
assets/
  source/
  production/
```

## 4. Configuración central
Toda la información variable debe vivir en un único objeto/configuración.

Ejemplo conceptual:
```ts
export const invitation = {
  honoree: "{{HONOREE_NAME}}",
  date: "{{EVENT_DATE}}",
  time: "{{EVENT_TIME}}",
  timezone: "{{EVENT_TIMEZONE}}",
  parents: ["{{PARENT_1}}", "{{PARENT_2}}"],
  venue: {
    name: "{{VENUE_NAME}}",
    address: "{{VENUE_ADDRESS}}",
    mapsUrl: "{{MAPS_URL}}"
  },
  whatsapp: "{{RSVP_WHATSAPP}}",
  rsvpDeadline: "{{RSVP_DEADLINE}}",
  maxGuests: "{{MAX_GUESTS}}",
  itinerary: "{{ITINERARY}}",
  audio: "{{AUDIO_ASSET}}"
}
```

## 5. Reglas de implementación
- No hardcodear datos del evento dentro de componentes.
- Cada escena debe ser componente independiente.
- Las escenas se conectan mediante un timeline narrativo.
- Evitar múltiples librerías de animación.
- ScrollTrigger controla las transiciones principales.
- Animaciones ambientales no deben bloquear interacción.
- Debe funcionar sin audio.
- Debe respetar `prefers-reduced-motion`.
- Lazy-load de fotografías fuera del primer viewport.
- Priorizar recursos críticos de escena 1–4.
- Optimizar imágenes para móvil.
- No cargar todos los videos/fotos al inicio.

## 6. RSVP
El formulario no persiste datos en V1.
Campos:
- nombre;
- total de asistentes.

Al enviar:
1. validar nombre;
2. validar total;
3. construir mensaje;
4. abrir WhatsApp con mensaje prearmado.

Placeholder:
```text
Hola, soy {{guest_name}}. Quiero confirmar mi asistencia a los XV de Camila para {{guest_count}} personas.
```

## 7. Módulo de recuerdos
Separar de la invitación principal.
Requisitos iniciales:
- ruta/página directa;
- carga múltiple;
- fotos y videos;
- progreso;
- éxito/error claro;
- sin autenticación para invitados;
- almacenamiento aislado;
- restricciones de tamaño y tipo;
- QR y botón directo apuntan al mismo destino.

La elección del storage/backend se decide en fase técnica final.

## 8. QR
Generar dinámicamente o a partir de URL definitiva.
No estilizar el patrón de forma agresiva.
La personalización visual ocurre en el marco/contenedor.

## 9. Performance
- Mobile-first.
- Carga progresiva de assets.
- Evitar videos de fondo pesados.
- Preferir SVG/CSS para elementos vectoriales.
- Preferir WebP/AVIF cuando sea adecuado.
- Mantener fallback si falla una animación.

## 10. Accesibilidad
- Texto con contraste suficiente.
- Botones con labels claros.
- `aria-label` para controles.
- Foco visible.
- Evitar animaciones obligatorias.
- Reduced motion.

## 11. Deploy en Vercel
- Repo Git conectado.
- Preview por rama/PR.
- `main` para producción.
- No promover a producción sin validar móvil, audio, WhatsApp, QR y carga de archivos.

## 12. Criterios de aceptación
- Las 19 escenas aparecen en orden correcto.
- La secuencia Dios → luz → familia → celebración está intacta.
- El audio requiere interacción.
- La cuenta regresiva usa la zona horaria correcta.
- RSVP arma correctamente el mensaje.
- Maps abre la ubicación correcta.
- La galería funciona por swipe.
- El QR resuelve al destino correcto.
- La carga de recuerdos funciona en móvil.
- El final no muestra CTA posterior al lago.
- Reduced motion sigue siendo usable.
