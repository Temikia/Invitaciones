import { ArrowUpRight, Camera } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { invitation } from "../../config/invitation";
import { Scene, Eyebrow, Divider, Ornament } from "../ui/Atmosphere";
import { RSVPForm } from "../ui/RSVPForm";
import { useLanguage } from "../../config/language";

export function Scene14Gifts() {
  const { t } = useLanguage();
  return (
    <Scene
      number={14}
      name={t("scene.14")}
      className="gifts-scene"
    >
      <div className="envelopes" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <Ornament
            name="envelope"
            className={`envelope envelope-${i}`}
            key={i}
          />
        ))}
      </div>
      <Eyebrow>{t("gift.eyebrow")}</Eyebrow>
      <h2 data-reveal>
        {t("gift.title")}
        <br />
        <em>{t("gift.title2")}</em>
      </h2>
      <p className="reading-copy" data-reveal>
        {t("message.gift")}
      </p>
      <p className="gift-label" data-reveal>
        {t("gift.label")}
      </p>
    </Scene>
  );
}
export function Scene15Dress() {
  const { t } = useLanguage();
  return (
    <Scene number={15} name={t("scene.15")} className="dress-scene">
      <Divider />
      <Eyebrow>{t("dress.eyebrow")}</Eyebrow>
      <h2 data-reveal>{invitation.dressCode}</h2>
      <p className="small-copy" data-reveal>
        {t("dress.copy")}
      </p>
      <Divider />
    </Scene>
  );
}
export function Scene16RSVP() {
  const { t } = useLanguage();
  return (
    <Scene number={16} name={t("scene.16")} className="rsvp-scene">
      <RSVPForm />
    </Scene>
  );
}
export function Scene17Memories() {
  const { t } = useLanguage();
  const url = new URL(invitation.uploads.path, window.location.origin).href;
  return (
    <Scene
      number={17}
      name={t("scene.17")}
      className="memories-scene"
    >
      <Camera size={25} strokeWidth={1} className="gold-icon" />
      <Eyebrow>{t("memories.eyebrow")}</Eyebrow>
      <h2 data-reveal>
        {t("memories.title")}
        <br />
        <em>{t("memories.title2")}</em>
      </h2>
      <p className="reading-copy" data-reveal>
        {t("memories.copy")}
      </p>
      <div className="qr-frame" data-reveal>
        <QRCodeSVG
          value={url}
          size={132}
          level="M"
          marginSize={4}
          title={t("memories.qr")}
        />
      </div>
      <a className="button" href={invitation.uploads.path}>
        {t("memories.upload")} <ArrowUpRight size={17} />
      </a>
    </Scene>
  );
}
export function Scene18Thanks() {
  const { t } = useLanguage();
  return (
    <Scene
      number={18}
      name={t("scene.18")}
      className="thanks-scene"
    >
      <Eyebrow>{t("thanks.eyebrow")}</Eyebrow>
      <h2 data-reveal>
        {t("thanks.title")}
        <br />
        <em>{t("thanks.title2")}</em>
      </h2>
      <p className="reading-copy" data-reveal>
        {t("message.thanks")}
      </p>
      <Divider />
    </Scene>
  );
}
export function Scene19Lake() {
  const { language, t } = useLanguage();
  const month = new Intl.DateTimeFormat(language, { timeZone: invitation.event.timezone, month: "long" }).format(new Date(invitation.event.iso));
  return (
    <Scene
      number={19}
      name={`${t("scene.19")}, ${invitation.event.day} ${month}`}
      className="lake-scene"
      background={
        <>
          <div className="lake-water" aria-hidden="true" />
        </>
      }
    >
      <div className="closing-signature" data-reveal>
        <p className="closing-name">{invitation.honoree}</p>
        <p className="xv-label">XV</p>
        <span className="closing-date">
          {invitation.event.day} <i>·</i> {month}
        </span>
      </div>
    </Scene>
  );
}
