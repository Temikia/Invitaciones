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
