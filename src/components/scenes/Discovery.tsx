import { invitation } from "../../config/invitation";
import { Scene, Eyebrow, Divider, Ornament } from "../ui/Atmosphere";
import { AudioControl } from "../ui/AudioControl";
import { MagicGardenHero } from "../ui/MagicGardenHero";
import { useLanguage } from "../../config/language";

export function Scene01Flower() {
  return <MagicGardenHero />;
}
export function Scene02Camila() {
  const { t } = useLanguage();
  return (
    <Scene
      number={2}
      id="continuar"
      name={t("scene.2")}
      className="name-scene"
    >
      <Eyebrow>{t("name.eyebrow")}</Eyebrow>
      <h1 data-reveal>{invitation.honoree}</h1>
      <p className="xv-label" data-reveal>
        {t("name.xv")}
      </p>
      <Divider />
      <p className="date-signature" data-reveal>
        {invitation.event.day} <span>·</span> {invitation.event.month}{" "}
        <span>·</span> {invitation.event.year}
      </p>
    </Scene>
  );
}
export function Scene03Music() {
  const { t } = useLanguage();
  return (
    <Scene number={3} name={t("scene.3")} className="music-scene">
      <AudioControl />
    </Scene>
  );
}
export function Scene04Portrait() {
  const { t } = useLanguage();
  return (
    <Scene number={4} name={t("scene.4")} className="portrait-scene">
      <figure className="hero-portrait glowing-frame" data-reveal>
        <div className="frame-glow" aria-hidden="true" />
        <div className="frame-inner">
          <img
            className="cinematic-photo"
            src={invitation.photos.hero}
            alt={t("portrait.alt")}
            width="1200"
            height="1600"
            loading="lazy"
          />
          <figcaption>
            {t("portrait.caption")}
            <br />
            <em>{t("portrait.caption2")}</em>
          </figcaption>
        </div>
      </figure>
    </Scene>
  );
}
export function Scene05Prayer() {
  const { t } = useLanguage();
  return (
    <Scene number={5} name={t("scene.5")} className="prayer-scene">
      <Eyebrow>{t("prayer.eyebrow")}</Eyebrow>
      <h2 data-reveal>{t("prayer.title")}</h2>
      <p className="reading-copy" data-reveal>
        {t("message.spiritual")}
      </p>
    </Scene>
  );
}
export function Scene06Sun() {
  const { t } = useLanguage();
  return (
    <Scene number={6} name={t("scene.6")} className="solar-scene">
      <div className="solar-halo">
        <Ornament name="sun" className="solar-symbol" />
      </div>
      <span className="vertical-thread" aria-hidden="true" />
    </Scene>
  );
}
export function Scene07Family() {
  const { t } = useLanguage();
  return (
    <Scene number={7} name={t("scene.7")} className="family-scene">
      <Eyebrow>{t("family.eyebrow")}</Eyebrow>
      <h2 className="parents" data-reveal>
        {invitation.parents[0]}
        <span>&</span>
        {invitation.parents[1]}
      </h2>
      <Divider />
      <p className="reading-copy" data-reveal>
        {t("message.family")}
      </p>
      <p className="serif invitation-line" data-reveal>
        {t("family.closing")}
      </p>
    </Scene>
  );
}
