/** Fuente de contenido: 05_CHECKLIST_PRE_DESARROLLO.md. */
export const invitation = {
  honoree: "Camila",
  event: {
    iso: "2026-11-22T17:00:00-07:00",
    timezone: "America/Denver",
    dateLabel: "Domingo 22 de noviembre de 2026",
    timeLabel: "5:00 p. m.",
    year: 2026,
    month: 11,
    monthName: "Noviembre",
    weekdayLabel: "Domingo",
    day: 22,
  },
  parents: ["Jesus Almerida", "Jessica Rodriguez"],
  venue: {
    name: "Zafira event center",
    address: "3133 Peoria St, Unit 201, Aurora, CO 80010",
    mapsUrl: "https://maps.app.goo.gl/PR8A7HhYScqkdtkf8?g_st=aw",
  },
  whatsapp: "17202369330",
  rsvpDeadline: "Antes del 10 de noviembre",
  maxGuests: null,
  dressCode: "Formal",
  messages: {
    opening:
      "Hay momentos que soñamos durante años. Hoy quiero compartir el mío contigo.",
    spiritual:
      "Dios, gracias por la vida, por mi familia y por cada persona que ilumina mi camino. Acompáñame en esta nueva etapa; que nunca me falten la fe para seguir, la gratitud para mirar atrás y el amor para compartir.",
    family:
      "Mamá y papá, gracias por sostener mis sueños y caminar a mi lado. Con el amor de mi familia, quiero invitarte a celebrar mis quince años y a formar parte de un recuerdo que guardaré siempre.",
    gift: "Tu presencia es mi mejor regalo, pero si deseas tener un detalle conmigo, una lluvia de sobres será recibida con mucho cariño.",
    thanks:
      "Gracias por acompañarme, por tu cariño y por ser parte de mi historia. Esta noche será más especial porque la compartiré contigo.",
  },
  photos: {
    hero: "/assets/production/photos/hero.svg",
    gallery: Array.from(
      { length: 5 },
      (_, i) => `/assets/production/photos/gallery-${i + 1}.webp`,
    ),
    companion: "/assets/production/photos/companion.webp",
  },
  audio: "/assets/production/audio/theme.mp3",
  itinerary: [
    { time: "17:00", label: "Recepción" },
    { time: "18:00", label: "Presentación" },
    { time: "18:20", label: "Vals" },
    { time: "18:50", label: "Ambiente musical y baile" },
    { time: "19:30–20:30", label: "Cena" },
    { time: "21:15", label: "Hora loca" },
    { time: "23:30–00:00", label: "Pastel y fotografía" },
    { time: "01:30", label: "Cierre y despedida · lunes 23" },
  ],
  uploads: {
    path: "/recuerdos",
    endpoint: null,
    photoMaxBytes: 20 * 1024 ** 2,
    videoMaxBytes: 400 * 1024 ** 2,
    maxFiles: 20,
    closesAt: "2026-12-07T00:00:00-07:00",
    retentionDays: 90,
  },
} as const;
