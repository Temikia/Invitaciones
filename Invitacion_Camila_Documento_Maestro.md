---

# 00_README.md

# Invitación XV de Camila — Paquete de definición

## Estado
Fase exploratoria y de definición creativa: **cerrada**.

Este paquete consolida las decisiones tomadas para la invitación digital de XV años de Camila, inspirada en el universo visual de *Enredados*, con una ejecución más madura, cinematográfica y elegante.

## Objetivo
Construir una invitación web vertical, mobile-first y altamente narrativa, donde Camila sea la protagonista y las referencias a *Enredados* funcionen como lenguaje visual, no como una reproducción infantil o literal de la película.

## Documentos incluidos
1. `01_ESPECIFICACION_MAESTRA.md`
2. `02_FICHAS_19_ESCENAS.md`
3. `03_FORMULARIO_LEVANTAMIENTO.md`
4. `04_INVENTARIO_ASSETS.md`
5. `05_CHECKLIST_PRE_DESARROLLO.md`
6. `06_HANDOFF_CODEX_HARNESS.md`
7. `07_PENDIENTES_Y_PLACEHOLDERS.md`

## Decisiones principales
- Experiencia vertical tipo “película” y no página con bloques independientes.
- Mobile-first.
- Paleta: morado profundo, dorado cálido, lavanda/rosa muy controlados y azul-negro para la noche.
- Tipografía: serif editorial elegante + sans limpia para textos funcionales.
- Animación con intención: flor, partículas, sol, galería, sobres, lámparas y transiciones por scroll.
- Navegación lineal por desplazamiento; sin menú ni tutorial.
- Música opcional activada por interacción del usuario.
- Confirmación de asistencia con formulario breve y envío por WhatsApp.
- Módulo separado de carga de fotos/videos mediante QR y botón directo.
- Un solo recinto para todo el evento.
- Arquitectura inicial ligera: frontend estático + módulo aislado de carga de recuerdos.

## Estado de la fecha
- Día: 22 de noviembre
- Hora: 5:00 PM
- Año: **pendiente de confirmar explícitamente** (se asume provisionalmente 2026).
- Zona horaria: **pendiente de confirmar** según la sede del evento.

## Nota de propiedad intelectual
La invitación puede inspirarse en los códigos visuales de *Enredados* (flor dorada, sol, morados, lago, lámparas, camaleón, reino fantástico), pero conviene evitar copiar artwork oficial, personajes exactos o música comercial sin autorización/licencia.


---

# 01_ESPECIFICACION_MAESTRA.md

# Especificación maestra — Invitación XV de Camila

## 1. Visión
La invitación debe sentirse como una experiencia cinematográfica vertical, mágica y elegante. La referencia a *Enredados* debe ser reconocible en atmósfera y símbolos, pero Camila debe ser siempre el centro narrativo.

No debe sentirse infantil ni como una plantilla temática. Debe evocar la sensación de que Camila pertenece a un universo fantástico inspirado en la película.

## 2. Principios de UX
- El usuario debe entender cómo usarla sin instrucciones.
- El gesto principal es hacer scroll.
- No habrá menú principal.
- No habrá navegación compleja entre secciones.
- Sólo se muestran controles cuando son necesarios:
  - reproducir música;
  - avanzar/interactuar con galería;
  - confirmar asistencia;
  - subir recuerdos.
- Las escenas no deben tener todas la misma altura.
- Las transiciones deben sentirse continuas, no como cortes entre páginas.
- La invitación debe funcionar correctamente sin audio.
- Debe existir comportamiento alternativo de movimiento reducido.

## 3. Dirección visual
### Paleta
- Morado profundo: base visual.
- Dorado cálido: magia, luz, líneas, partículas y acentos.
- Lavanda y rosa: apoyo muy limitado.
- Azul-negro/violeta-negro: escenas nocturnas.

### Tipografía
- Títulos y nombres: serif elegante/editorial.
- Información funcional: sans serif limpia y moderna.
- Evitar tipografías “de cuento” o infantiles.

### Movimiento
Nada se anima sin propósito narrativo.
- La flor abre.
- Las partículas conectan escenas.
- El sol funciona como símbolo y portal.
- Las fotos entran con profundidad y luz.
- Los sobres caen suavemente.
- Las lámparas ascienden con distintas velocidades.
- La iluminación evoluciona desde misterio → calidez → atardecer → noche.

## 4. Ritmo narrativo
### Acto I — Descubrimiento
1. Flor dorada.
2. Camila · Mis XV.
3. Música.
4. Fotografía principal.
5. Palabras a Dios.
6. Sol.
7. Padres + invitación formal.

### Acto II — Celebración
8. Fecha, hora y calendario.
9. Ubicación.
10. Galería.
11. Itinerario.
12. Camila + camaleón.
13. Cuenta regresiva.

### Acto III — Participación y cierre
14. Lluvia de sobres.
15. Código de vestimenta.
16. Confirmación + formulario + WhatsApp.
17. Fotos y videos / QR.
18. Agradecimiento final.
19. Lago y lámparas.

## 5. Secuencia simbólica clave
**Dios → luz → familia → celebración**

Este orden debe preservarse.

## 6. Audio
- El audio no debe iniciar automáticamente.
- Debe existir un control para comenzar la experiencia musical.
- Si se usa una canción comercial de *Enredados*, debe verificarse su licencia.
- Alternativa preferible: instrumental licenciada u original que evoque la misma emoción.

## 7. Fotografías
Solicitar originales en máxima calidad.
- No recortar ni quitar fondo previamente.
- Priorizar fotografías:
  - cuerpo completo;
  - medio cuerpo;
  - retrato;
  - verticales y horizontales;
  - con espacio alrededor del cuerpo;
  - algunas con fondo limpio y separación clara de cabello/brazos.
- Los recortes y composiciones se prepararán después según escena.

## 8. Confirmación de asistencia
Dentro de la propia escena:
- Campo: Nombre.
- Campo: Total de asistentes (incluyéndose).
- Opcional: límite máximo permitido.
- Botón: “Confirmar por WhatsApp”.
- Mensaje prearmado, por ejemplo:
  “Hola, soy {{guest_name}}. Quiero confirmar mi asistencia a los XV de Camila para {{guest_count}} personas.”

No se requiere base de datos para RSVP en esta primera versión.

## 9. Recuerdos del evento
Debe existir:
- QR reutilizable en invitación e impresos.
- Botón directo “Subir fotos y videos”.
- Página/módulo de carga independiente.
- Sin registro obligatorio.
- Múltiples archivos.
- Progreso de carga.
- Mensaje final de agradecimiento.
- El periodo de disponibilidad queda pendiente de definir.

## 10. Ubicación
Todo ocurre en una sola sede.
Debe mostrarse:
- Nombre oficial del recinto.
- Dirección exacta.
- Botón “Cómo llegar”.
- Link de Google Maps.
- No usar mapa grande embebido salvo que se justifique.

## 11. Calendario
No reducir la escena a un número “22”.
Debe existir una representación visual elegante del calendario de noviembre, manteniendo la composición editorial.

## 12. Criterio de cierre
La invitación termina con el lago y las lámparas.
Último texto:
- Camila
- XV
- 22 · 11

No mostrar botones, créditos, WhatsApp ni navegación después del cierre.


---

# 02_FICHAS_19_ESCENAS.md

# Fichas de producción — 19 escenas

## Convención de origen de assets
- `USTEDES`: datos o materiales reales del evento.
- `IA`: recurso visual generado.
- `DESARROLLO`: CSS/SVG/código/animación.
- `EXTERNO`: herramienta o profesional externo.
- `LICENCIA`: material sujeto a derechos.
- `PENDIENTE`: decisión aún abierta.

---

## 01 — Flor dorada
**Objetivo:** primer impacto; abrir la experiencia con misterio y magia elegante.  
**Visual:** fondo violeta casi negro; flor cerrada en centro; iluminación cálida progresiva.  
**Animación:** pétalos se abren por capas; brillo central; partículas doradas ascienden.  
**Texto provisional:** “Hay momentos que parecen sacados de un sueño…”  
**Ritmo:** lento.  
**Transición:** partículas ascienden y preparan el nombre de Camila.  
**Assets:** flor por capas (`DESARROLLO/SVG` o `EXTERNO` si requiere ilustración compleja), partículas (`DESARROLLO`), fondo (`IA/DESARROLLO`).  

## 02 — Camila · Mis XV
**Objetivo:** presentar a la protagonista.  
**Visual:** nombre dominante, “Mis XV años” secundario.  
**Animación:** el brillo de las partículas revela el nombre.  
**Ritmo:** medio-lento.  
**Assets:** tipografía/composición (`DESARROLLO`).  

## 03 — Música
**Objetivo:** ofrecer control sobre el ambiente.  
**Visual:** control circular sutil, no reproductor convencional.  
**Copy sugerido:** “Comenzar la experiencia” o “Escuchar nuestra canción”.  
**Comportamiento:** al tocar, inicia audio y activa mayor vida ambiental.  
**Assets:** pista (`USTEDES/LICENCIA`), control (`DESARROLLO`).  

## 04 — Fotografía principal
**Objetivo:** “entrada de personaje” de Camila.  
**Visual:** fotografía grande, tratamiento cinematográfico.  
**Animación:** revelado por luz, no simple fade.  
**Assets:** foto original (`USTEDES`), recorte/ajuste si aplica (`IA/PRODUCCIÓN`).  

## 05 — Palabras a Dios
**Objetivo:** momento espiritual y contemplativo.  
**Visual:** poco movimiento, espacio, luz suave.  
**Animación:** texto entra lentamente; partículas casi detenidas.  
**Assets:** texto definitivo (`USTEDES`), atmósfera (`IA/DESARROLLO`).  

## 06 — Sol
**Objetivo:** símbolo visual y puente entre lo espiritual y la familia.  
**Visual:** símbolo solar dorado.  
**Animación:** se dibuja/progresa y se ilumina desde el centro.  
**Transición:** la luz del sol revela la escena familiar.  
**Assets:** sol (`DESARROLLO/SVG`).  

## 07 — Padres + invitación formal
**Objetivo:** unir agradecimiento familiar e invitación oficial.  
**Contenido:** “Acompáñame a celebrar este día tan especial junto a mis padres…” + nombres.  
**Visual:** ceremonial, elegante, pocos ornamentos.  
**Assets:** nombres y texto (`USTEDES`), ornamentos (`DESARROLLO`).  

## 08 — Fecha, hora y calendario
**Objetivo:** presentar el cuándo.  
**Contenido:** 22 de noviembre · 5:00 PM. Año por confirmar.  
**Visual:** “22” protagonista + calendario de noviembre elegante.  
**Animación:** composición editorial; transición hacia ubicación.  
**Assets:** fecha/hora/año (`USTEDES`), calendario (`DESARROLLO`).  

## 09 — Ubicación
**Objetivo:** mostrar dónde llegar sin romper la estética.  
**Contenido:** recinto, dirección, botón “Cómo llegar”.  
**Visual:** tarjeta ceremonial, iconografía sutil.  
**Comportamiento:** abre Google Maps.  
**Assets:** nombre/dirección/link (`USTEDES`), iconografía (`DESARROLLO/SVG`).  

## 10 — Galería
**Objetivo:** mostrar 4–5 fotografías como editorial fotográfica.  
**Visual:** tamaños y composiciones variables; no carrusel genérico.  
**Interacción:** swipe/gesto para avanzar.  
**Animación:** profundidad, entrada lateral o por capas.  
**Assets:** 4–5 fotos (`USTEDES`), recortes si aplica (`IA/PRODUCCIÓN`).  

## 11 — Itinerario
**Objetivo:** mostrar momentos del evento.  
**Visual:** línea dorada vertical con símbolos consistentes.  
**Animación:** cada momento aparece al avanzar.  
**Assets:** itinerario/hora (`USTEDES`), iconos (`DESARROLLO/SVG`).  

## 12 — Camila + camaleón
**Objetivo:** guiño ligero y memorable.  
**Visual:** Camila protagonista; camaleón como detalle secundario.  
**Animación:** descubrimiento sutil, nunca caricaturesco.  
**Assets:** fotografía (`USTEDES`), camaleón original (`IA/ILUSTRACIÓN`), fondo (`IA` si se reemplaza).  
**Nota:** evitar copiar exactamente a Pascal sin autorización.

## 13 — Cuenta regresiva
**Objetivo:** anticipación.  
**Contenido:** días, horas, minutos, segundos.  
**Copy opcional:** “Cada vez falta menos…”  
**Visual:** transición hacia noche.  
**Lógica:** debe usar zona horaria del evento.  
**Assets:** fecha/hora/zona horaria (`USTEDES`), lógica (`DESARROLLO`).  

## 14 — Lluvia de sobres
**Objetivo:** comunicar sugerencia de regalo con tacto.  
**Copy provisional:** “Tu presencia es el mejor regalo.” + explicación breve.  
**Visual:** sobres dorados en distintas profundidades.  
**Animación:** lluvia ligera, no confeti.  
**Assets:** texto (`USTEDES`), sobres (`DESARROLLO/SVG`).  

## 15 — Código de vestimenta
**Objetivo:** comunicar vestimenta de inmediato.  
**Contenido:** Código de vestimenta · Formal.  
**Visual:** composición limpia, gala, mucho espacio.  
**Assets:** dress code (`USTEDES`), marco y ornamentos (`DESARROLLO`).  

## 16 — Confirmación + formulario + WhatsApp
**Objetivo:** RSVP sin fricción.  
**Campos:** nombre; total de asistentes incluyéndose.  
**Interacción:** selector numérico y botón “Confirmar por WhatsApp”.  
**Mensaje:** prearmado con nombre y número.  
**Datos pendientes:** número receptor, fecha límite, máximo de acompañantes.  
**Assets:** datos (`USTEDES`), UI/lógica (`DESARROLLO`).  

## 17 — Fotos y videos / QR
**Objetivo:** recopilar recuerdos de invitados.  
**Contenido:** “Ayúdanos a guardar esta noche para siempre.”  
**UI:** QR + botón “Subir fotos y videos”.  
**Comportamiento:** acceso a página de carga independiente.  
**Assets:** QR (`DESARROLLO`), texto (`NOSOTROS + VALIDACIÓN`), almacenamiento (`FASE TÉCNICA`).  

## 18 — Agradecimiento final
**Objetivo:** última interacción humana de Camila con el invitado.  
**Visual:** oscuro, íntimo, primeras luces lejanas.  
**Copy provisional:** “Gracias por ser parte de mi historia…”  
**Animación:** extremadamente lenta.  
**Assets:** texto (`USTEDES`, podemos pulirlo), fondo (`IA`), luces (`DESARROLLO`).  

## 19 — Lago y lámparas
**Objetivo:** clímax visual y cierre emocional.  
**Visual por capas:** agua, reflejos, primer plano, plano medio, fondo, cielo violeta-negro.  
**Animación:** lámparas ascienden a distintas velocidades y profundidades.  
**Final:** Camila · XV · 22 · 11.  
**Assets:** lago/cielo (`IA/PRODUCCIÓN`), lámparas (`DESARROLLO/SVG`), reflejos (`DESARROLLO`).  
**Regla:** no mostrar ningún CTA después.


---

# 03_FORMULARIO_LEVANTAMIENTO.md

# Formulario / entrevista de levantamiento

## A. Datos generales
1. Nombre completo de la quinceañera:
2. ¿Cómo debe aparecer el nombre en pantalla?
3. Fecha completa del evento:
4. Hora exacta de inicio:
5. Zona horaria del lugar:
6. Nombre oficial del recinto:
7. Dirección exacta:
8. Link de Google Maps:
9. ¿Todo el evento ocurre en la misma sede? Sí / No.
10. ¿Hay información de estacionamiento, valet o acceso que deba mostrarse?

## B. Familia
11. Nombre completo del padre:
12. Nombre completo de la madre:
13. ¿Desean un texto específico de agradecimiento a los padres?
14. ¿Hay algún orden o forma específica de presentar los nombres?

## C. Mensaje espiritual
15. Texto o idea principal del mensaje a Dios:
16. ¿Desean una cita, frase bíblica o sólo agradecimiento personal?
17. ¿Debe mencionarse alguna persona o intención especial?

## D. Fotografías
18. ¿Cuántas fotografías originales tienen?
19. ¿En qué resolución/formato?
20. Marcar las disponibles:
   - Retrato.
   - Medio cuerpo.
   - Cuerpo completo.
   - Verticales.
   - Horizontales.
   - Con familia.
   - Fondo limpio.
   - Espacio alrededor del cuerpo.
   - Cabello/brazos bien separados del fondo.
21. ¿Hay fotografías que NO debamos recortar o modificar?
22. ¿Autorizan ajustes de color, recorte y composición de fondo?
23. ¿Cuál foto consideran la principal?

## E. Música
24. Opción deseada:
   - Canción comercial específica.
   - Instrumental similar.
   - Música original/licenciada.
   - Aún por decidir.
25. Nombre de la canción si aplica:
26. ¿Cuentan con autorización/licencia de uso?
27. ¿Debe reproducirse durante toda la experiencia o sólo algunas escenas?

## F. Itinerario
28. Indicar cada momento con hora:
   - Recepción:
   - Entrada/presentación:
   - Ceremonia:
   - Vals:
   - Cena:
   - Brindis:
   - Fiesta:
   - Otros:
29. ¿Hay momentos que NO deban aparecer?

## G. Vestimenta y regalos
30. Código de vestimenta definitivo:
31. ¿Hay colores restringidos?
32. ¿Desean sugerencia de “lluvia de sobres”?
33. Texto deseado para regalos:
34. ¿Hay otras opciones de regalo?

## H. RSVP
35. Número de WhatsApp receptor:
36. Fecha límite para confirmar:
37. ¿Máximo de asistentes por invitación?
38. ¿Sólo nombre + número total de asistentes?
39. ¿Se requiere distinguir adultos/niños?
40. ¿Mensaje prearmado deseado?

## I. Fotos y videos del evento
41. ¿Desean habilitar la carga antes del evento?
42. ¿Durante cuánto tiempo después del evento?
43. ¿Se permiten fotos y videos?
44. ¿Desean límite de tamaño por archivo?
45. ¿Desean galería privada para los padres en una fase posterior?
46. ¿Quién será propietario/administrador de esos archivos?

## J. Agradecimiento final
47. ¿Camila escribirá el mensaje?
48. ¿Desean que nosotros lo redactemos a partir de ideas?
49. Ideas o frases que sí deben aparecer:
50. Frases o tonos que se deben evitar:

## K. Referencias visuales
51. ¿Qué tan evidente debe ser la inspiración en *Enredados*?
   - Muy sutil.
   - Intermedia.
   - Clara, pero elegante.
52. ¿Qué elementos son imprescindibles?
   - Flor dorada.
   - Sol.
   - Camaleón.
   - Lago.
   - Lámparas.
   - Torre/bosque.
   - Otros.
53. ¿Qué elementos NO quieren?
54. ¿Hay referencias de estilo adicionales?

## L. Validación final
55. ¿Autorizan utilizar recursos visuales generados con IA?
56. ¿Autorizan modificar fondos de fotografías?
57. ¿Hay restricciones de propiedad intelectual que debamos respetar?
58. Persona final que aprueba diseño y textos:


---

# 04_INVENTARIO_ASSETS.md

# Inventario maestro de assets

## Estados
- `RECIBIDO`
- `PENDIENTE`
- `GENERAR_CON_IA`
- `CREAR_EN_CODIGO`
- `EXTERNO`
- `REQUIERE_LICENCIA`
- `VALIDAR`

## USTEDES
- Fotografías originales de Camila en máxima resolución.
- Nombres completos de los padres.
- Texto espiritual / ideas base.
- Texto de agradecimiento final / ideas base.
- Fecha, hora, año y zona horaria.
- Nombre del recinto.
- Dirección exacta.
- Link de Google Maps.
- Itinerario con horas.
- Dress code definitivo.
- Texto de regalos/lluvia de sobres.
- Número de WhatsApp receptor.
- Fecha límite RSVP.
- Máximo de asistentes por invitación, si existe.
- Decisión sobre música.
- Audio/licencia, si usan canción comercial.

## IA
- Fondo bosque mágico.
- Atmósferas de transición.
- Fondo del lago.
- Cielo nocturno.
- Texturas y reflejos de apoyo.
- Flores ornamentales.
- Escenarios donde se integre a Camila.
- Camaleón original inspirado en el universo visual.
- Variantes de iluminación y fondos.
- Elementos atmosféricos no geométricos.

## DESARROLLO / SVG / CSS
- Sol vectorial.
- Flor por capas si la complejidad lo permite.
- Lámparas base y variantes.
- Sobres.
- Iconografía de itinerario.
- Marcos y líneas doradas.
- Partículas.
- Destellos.
- Calendario.
- Controles de música.
- Cuenta regresiva.
- Formulario RSVP.
- Botón/link WhatsApp.
- QR.
- UI de carga de recuerdos.
- Reflejos y movimiento del agua cuando sea viable por código.

## EXTERNO
Sólo si la calidad requerida supera lo razonable para IA/código:
- Ilustración compleja de flor por capas.
- Retoque fotográfico premium.
- Composición fotográfica avanzada.
- Diseño vectorial especializado.
- Masterización musical.

## REQUIERE LICENCIA
- Canción original de *Enredados* o cualquier pista comercial.
- Artwork oficial de Disney.
- Personajes exactos de Disney.
- Logos o ilustraciones oficiales.

## Estructura propuesta
```text
/assets
  /source
    /photos
    /audio
    /references
  /production
    /photos
    /backgrounds
    /vectors
    /icons
    /audio
    /qr
/content
/spec
```

## Regla
Nunca sobreescribir los originales. Todo recurso derivado debe vivir en `/assets/production`.


---

# 05_CHECKLIST_PRE_DESARROLLO.md

# Checklist previo a desarrollo

## Bloque A — Debe estar definido
- [ ] Nombre final visible de Camila.
- [ ] Fecha completa.
- [ ] Hora.
- [ ] Año.
- [ ] Zona horaria.
- [ ] Recinto.
- [ ] Dirección.
- [ ] Link de Google Maps.
- [ ] Nombres de los padres.
- [ ] Itinerario.
- [ ] Dress code.
- [ ] Número WhatsApp RSVP.
- [ ] Fecha límite RSVP.
- [ ] Máximo de asistentes, si aplica.
- [ ] Política de fotos/videos.
- [ ] Decisión sobre música.

## Bloque B — Debe existir o estar sustituido por placeholder
- [ ] Foto principal.
- [ ] 4–5 fotos para galería.
- [ ] Foto candidata para escena con camaleón.
- [ ] Mensaje a Dios.
- [ ] Mensaje a padres/invitación formal.
- [ ] Texto de regalos.
- [ ] Agradecimiento final.

## Bloque C — Recursos visuales
- [ ] Flor dorada.
- [ ] Sol.
- [ ] Fondos base.
- [ ] Camaleón original.
- [ ] Lago.
- [ ] Lámparas.
- [ ] Iconografía itinerario.
- [ ] Sobres.
- [ ] Calendario.

## Bloque D — Decisiones técnicas
- [ ] Stack aprobado.
- [ ] Estrategia de hosting.
- [ ] Estrategia de almacenamiento de recuerdos.
- [ ] Límites de archivos.
- [ ] Periodo de disponibilidad de carga.
- [ ] Gestión del QR.
- [ ] Manejo de reduced motion.
- [ ] Política de optimización de imágenes y video.

## Bloque E — Legal/IP
- [ ] Música autorizada o reemplazada por alternativa licenciada.
- [ ] No uso de artwork oficial sin autorización.
- [ ] No uso del personaje exacto de Pascal salvo autorización.
- [ ] Aprobación de fotografías y modificaciones.

## Criterio para abrir Codex
Se puede iniciar construcción con placeholders aunque falten textos/fotos, siempre que:
1. el orden de escenas esté congelado;
2. la estructura de archivos esté definida;
3. los placeholders estén identificados;
4. la arquitectura del módulo de recuerdos esté decidida;
5. los assets críticos para layout tengan representación temporal.


---

# 06_HANDOFF_CODEX_HARNESS.md

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


---

# 07_PENDIENTES_Y_PLACEHOLDERS.md

# Pendientes y placeholders

## Datos pendientes críticos
- `{{EVENT_YEAR}}`
- `{{EVENT_TIMEZONE}}`
- `{{VENUE_NAME}}`
- `{{VENUE_ADDRESS}}`
- `{{MAPS_URL}}`
- `{{PARENT_1}}`
- `{{PARENT_2}}`
- `{{SPIRITUAL_MESSAGE}}`
- `{{PARENTS_MESSAGE}}`
- `{{ITINERARY}}`
- `{{GIFT_MESSAGE}}`
- `{{RSVP_WHATSAPP}}`
- `{{RSVP_DEADLINE}}`
- `{{MAX_GUESTS}}`
- `{{FINAL_MESSAGE}}`
- `{{AUDIO_ASSET}}`
- `{{UPLOAD_AVAILABILITY_WINDOW}}`

## Assets pendientes
- `{{HERO_PHOTO}}`
- `{{GALLERY_PHOTO_1}}`
- `{{GALLERY_PHOTO_2}}`
- `{{GALLERY_PHOTO_3}}`
- `{{GALLERY_PHOTO_4}}`
- `{{GALLERY_PHOTO_5}}`
- `{{CAMELEON_SCENE_PHOTO}}`

## Decisiones pendientes
1. Música final y licencia.
2. Periodo de disponibilidad del módulo de carga.
3. Límites de tamaño para video/foto.
4. Storage/backend para recuerdos.
5. Si habrá galería privada para padres en fase 2.
6. Si la lluvia de sobres tendrá copy literal o más sutil.
7. Si RSVP distingue adultos/niños.
8. Si hay máximo de asistentes por invitación.
9. Si existe fecha límite de RSVP.
10. Si el camaleón será original o se buscará autorización para usar personaje exacto.

## Supuestos actuales
- Evento: 22 de noviembre, 5:00 PM.
- Año provisional: 2026.
- Todo el evento ocurre en una sola sede.
- Código de vestimenta: Formal.
- RSVP vía WhatsApp.
- Módulo de recuerdos sin login para invitados.
- Experiencia mobile-first.
