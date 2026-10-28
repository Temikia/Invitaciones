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
    name: "Zafiro event center",
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
    gift: "Pero si deseas tener un detalle conmigo, te dejo esta opción.",
    thanks:
      "Gracias por acompañarme, por tu cariño y por ser parte de mi historia. Esta noche será más especial porque la compartiré contigo.",
  },
  photos: {
    hero: "/assets/production/photos/hero.svg",
    heroGarden: "/assets/production/photos/camila-jardin-encantado.webp",
    galleryHeroMain: "/assets/production/photos/gallery-hero-main.webp",
    galleryHeroSecondary: "/assets/production/photos/gallery-hero-secondary.webp",
    gallery: Array.from(
      { length: 7 },
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

/** Capítulos para las fotografías elegidas, en su orden de presentación. */
export const galleryChapters = [
  { name: "La magia", title: "Un instante fuera del", accent: "tiempo.", description: "El cielo dorado, una mirada y ese momento en el que todo parecía posible.", quote: "Y así comienza la historia", alt: "Camila con vestido lila junto a un caballo blanco al atardecer" },
  { name: "Ella", title: "Ella es", accent: "la historia.", description: "En su sonrisa caben todos los sueños que están por llegar. Este momento le pertenece.", quote: "La protagonista de su propio cuento", alt: "Camila sonriendo mientras toca su corona, con un ramo de flores" },
  { name: "Los detalles", title: "La belleza de lo", accent: "pequeño.", description: "Flores, texturas, gestos. Esos detalles que un día nos harán volver a sentirlo todo.", quote: "La magia vive en los detalles", alt: "Camila con su ramo de flores junto a unas columnas doradas" },
  { name: "La luz", title: "El sol quiso", accent: "quedarse.", description: "La tarde nos regaló su último destello, como si también quisiera ser parte de esta historia.", quote: "Hay luces que nunca se apagan", alt: "Camila sentada en el jardín con flores y la luz del atardecer" },
  { name: "El sueño", title: "Un vestido. Mil", accent: "ilusiones.", description: "Un sueño lila que no termina aquí. Apenas es el principio de todo lo que está por venir.", quote: "Lo mejor está por comenzar", alt: "Camila sonriendo con su vestido lila y un ramo de flores violetas" },
  { name: "El encanto", title: "Entre destellos", accent: "dorados.", description: "Un vestido lila, una corona y la calidez de un salón que parece guardar historias de otro tiempo.", quote: "Un momento para atesorar", alt: "Camila con vestido lila y corona en un salón de arcos y barandales dorados" },
  { name: "El comienzo", title: "El mundo espera", accent: "su sonrisa.", description: "Frente a las columnas y bajo el cielo azul, una sonrisa anuncia todos los caminos que están por descubrir.", quote: "La historia apenas comienza", alt: "Camila con su ramo de flores frente a un edificio de columnas blancas y cielo azul" },
];
