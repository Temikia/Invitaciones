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
import { useLanguage } from "../../config/language";

export function Scene08Date() {
  const { language, t } = useLanguage();
  const date = new Date(invitation.event.iso);
  const month = new Intl.DateTimeFormat(language, { timeZone: invitation.event.timezone, month: "long" }).format(date);
  const weekday = new Intl.DateTimeFormat(language, { timeZone: invitation.event.timezone, weekday: "long" }).format(date);
  const time = new Intl.DateTimeFormat(language, { timeZone: invitation.event.timezone, hour: "numeric", minute: "2-digit" }).format(date);
  return (
    <Scene
      number={8}
      name={t("scene.8")}
      className="date-scene"
    >
      <Eyebrow>{t("date.eyebrow")}</Eyebrow>
      <div className="date-layout">
        <div className="date-editorial" data-reveal>
          <span className="date-day">{invitation.event.day}</span>
          <h2>{month}</h2>
          <p>
            {weekday} · {invitation.event.year}
          </p>
          <Divider />
          <p className="event-time">{time}</p>
          <p className="small-copy">{t("event.timezone")}</p>
        </div>
      </div>
    </Scene>
  );
}
export function Scene09Venue() {
  const { t } = useLanguage();
  return (
    <Scene number={9} name={t("scene.9")} className="venue-scene">
      <div className="venue-arch" data-reveal>
        <MapPin className="gold-icon" size={25} strokeWidth={1} />
        <Eyebrow>{t("venue.eyebrow")}</Eyebrow>
        <h2>{invitation.venue.name}</h2>
        <p className="venue-address">{invitation.venue.address}</p>
        <p className="small-copy">{t("venue.copy")}</p>
        <a
          className="button"
          href={invitation.venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("venue.directions")} <ArrowUpRight size={17} />
        </a>
      </div>
    </Scene>
  );
}
export function Scene10Gallery() {
  const { t } = useLanguage();
  return (
    <Scene
      number={10}
      name={t("scene.10")}
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
  const { t } = useLanguage();
  return (
    <Scene
      number={11}
      name={t("scene.11")}
      className="itinerary-scene"
    >
      <Eyebrow>{t("itinerary.eyebrow")}</Eyebrow>
      <h2 data-reveal>
        {t("itinerary.title")}
        <br />
        <em>{t("itinerary.title2")}</em>
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
              <h3>{t(`itinerary.${index}`)}</h3>
            </li>
          );
        })}
      </ol>
    </Scene>
  );
}
export function Scene12Companion() {
  const { t } = useLanguage();
  return (
    <Scene number={12} name={t("scene.12")} className="companion-scene">
      <div className="companion-frame glowing-frame" data-reveal>
        <div className="frame-glow" aria-hidden="true" />
        <div className="frame-inner">
          <img
            className="cinematic-photo"
            src={invitation.photos.companion}
            alt={t("companion.alt")}
            width="1200"
            height="1600"
            loading="lazy"
          />
        </div>
      </div>
      <p className="serif" data-reveal>
        {t("companion.line1")}
        <br />
        {t("companion.line2")}
      </p>
    </Scene>
  );
}
export function Scene13Countdown() {
  const { t } = useLanguage();
  return (
    <Scene number={13} name={t("scene.13")} className="countdown-scene">
      <Eyebrow>{t("countdown.eyebrow")}</Eyebrow>
      <h2 data-reveal>{t("countdown.title")}</h2>
      <Countdown />
    </Scene>
  );
}
