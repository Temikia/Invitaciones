import {
  MapPin,
  ArrowUpRight,
  Music2,
  Sparkles,
  Utensils,
  Camera,
  Wine,
  Heart,
} from "lucide-react";
import { invitation } from "../../config/invitation";
import { Scene, Eyebrow, Divider } from "../ui/Atmosphere";
import { Gallery } from "../ui/Gallery";
import { Countdown } from "../ui/Countdown";

export function Scene08Date() {
  return (
    <Scene
      number={8}
      name="La fecha de nuestro encuentro"
      className="date-scene"
    >
      <Eyebrow>Reserva este día para soñar</Eyebrow>
      <div className="date-layout">
        <div className="date-editorial" data-reveal>
          <span className="date-day">{invitation.event.day}</span>
          <h2>{invitation.event.monthName}</h2>
          <p>
            {invitation.event.weekdayLabel} · {invitation.event.year}
          </p>
          <Divider />
          <p className="event-time">{invitation.event.timeLabel}</p>
          <p className="small-copy">Hora de Denver, Colorado</p>
        </div>
      </div>
    </Scene>
  );
}
export function Scene09Venue() {
  return (
    <Scene number={9} name="El lugar de la celebración" className="venue-scene">
      <div className="venue-arch" data-reveal>
        <MapPin className="gold-icon" size={25} strokeWidth={1} />
        <Eyebrow>Nos encontramos en</Eyebrow>
        <h2>{invitation.venue.name}</h2>
        <p className="venue-address">{invitation.venue.address}</p>
        <p className="small-copy">Toda la celebración en un mismo lugar</p>
        <a
          className="button"
          href={invitation.venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cómo llegar <ArrowUpRight size={17} />
        </a>
      </div>
    </Scene>
  );
}
export function Scene10Gallery() {
  return (
    <Scene
      number={10}
      name="Instantes de mi historia"
      className="gallery-scene"
    >
      <Gallery />
    </Scene>
  );
}
const itineraryIcons = [
  Wine,
  Sparkles,
  Heart,
  Music2,
  Utensils,
  Sparkles,
  Camera,
  Heart,
];
export function Scene11Itinerary() {
  return (
    <Scene
      number={11}
      name="Itinerario de la noche"
      className="itinerary-scene"
    >
      <Eyebrow>Cada momento, una memoria</Eyebrow>
      <h2 data-reveal>
        Así se escribe
        <br />
        <em>esta noche.</em>
      </h2>
      <ol className="itinerary">
        {invitation.itinerary.map((item, index) => {
          const Icon = itineraryIcons[index];
          return (
            <li key={item.label} data-reveal>
              <span className="itinerary-icon">
                <Icon size={20} strokeWidth={1.2} />
              </span>
              <time>{item.time}</time>
              <h3>{item.label}</h3>
            </li>
          );
        })}
      </ol>
    </Scene>
  );
}
export function Scene12Companion() {
  return (
    <Scene number={12} name="Un poco de magia" className="companion-scene">
      <div className="companion-frame glowing-frame" data-reveal>
        <div className="frame-glow" aria-hidden="true" />
        <div className="frame-inner">
          <img
            className="cinematic-photo"
            src={invitation.photos.companion}
            alt="Camila, un recuerdo lleno de magia"
            width="1200"
            height="1600"
            loading="lazy"
          />
        </div>
      </div>
      <p className="serif" data-reveal>
        Los mejores sueños
        <br />
        se viven acompañados.
      </p>
    </Scene>
  );
}
export function Scene13Countdown() {
  return (
    <Scene number={13} name="Cuenta regresiva" className="countdown-scene">
      <Eyebrow>Mi sueño está cada vez más cerca</Eyebrow>
      <h2 data-reveal>Falta tan poquito…</h2>
      <Countdown />
    </Scene>
  );
}
