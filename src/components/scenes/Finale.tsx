import { ArrowUpRight, Camera } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { invitation } from "../../config/invitation";
import { Scene, Eyebrow, Divider, Ornament, Particles } from "../ui/Atmosphere";
import { RSVPForm } from "../ui/RSVPForm";

export function Scene14Gifts() {
  return (
    <Scene
      number={14}
      name="Tu presencia es mi mejor regalo"
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
      <Eyebrow>El regalo de estar juntos</Eyebrow>
      <h2 data-reveal>
        Tu presencia,
        <br />
        <em>mi mejor regalo.</em>
      </h2>
      <p className="reading-copy" data-reveal>
        {invitation.messages.gift}
      </p>
      <p className="gift-label" data-reveal>
        Lluvia de sobres
      </p>
    </Scene>
  );
}
export function Scene15Dress() {
  return (
    <Scene number={15} name="Código de vestimenta" className="dress-scene">
      <Divider />
      <Eyebrow>Una noche para brillar</Eyebrow>
      <h2 data-reveal>{invitation.dressCode}</h2>
      <p className="small-copy" data-reveal>
        Código de vestimenta
      </p>
      <Divider />
    </Scene>
  );
}
export function Scene16RSVP() {
  return (
    <Scene number={16} name="Confirma tu asistencia" className="rsvp-scene">
      <Eyebrow>Hay un lugar para ti</Eyebrow>
      <h2 data-reveal>¿Me acompañas?</h2>
      <p className="reading-copy" data-reveal>
        Me encantará compartir esta noche contigo.
        <br />
        Confirma tu asistencia {invitation.rsvpDeadline.toLowerCase()}.
      </p>
      <RSVPForm />
    </Scene>
  );
}
export function Scene17Memories() {
  const url = new URL(invitation.uploads.path, window.location.origin).href;
  return (
    <Scene
      number={17}
      name="Compartamos los recuerdos"
      className="memories-scene"
    >
      <Camera size={25} strokeWidth={1} className="gold-icon" />
      <Eyebrow>Tu mirada también cuenta esta historia</Eyebrow>
      <h2 data-reveal>
        Guardemos esta noche
        <br />
        <em>para siempre.</em>
      </h2>
      <p className="reading-copy" data-reveal>
        Comparte las fotos y videos que tomes durante la celebración.
      </p>
      <div className="qr-frame" data-reveal>
        <QRCodeSVG
          value={url}
          size={132}
          level="M"
          marginSize={4}
          title="Abre la página para compartir recuerdos de Camila"
        />
      </div>
      <a className="button" href={invitation.uploads.path}>
        Subir fotos y videos <ArrowUpRight size={17} />
      </a>
    </Scene>
  );
}
export function Scene18Thanks() {
  return (
    <Scene
      number={18}
      name="Gracias por ser parte de mi historia"
      className="thanks-scene"
    >
      <Eyebrow>Las personas hacen la magia</Eyebrow>
      <h2 data-reveal>
        Gracias por ser parte
        <br />
        <em>de mi historia.</em>
      </h2>
      <p className="reading-copy" data-reveal>
        {invitation.messages.thanks}
      </p>
      <Divider />
    </Scene>
  );
}
export function Scene19Lake() {
  return (
    <Scene
      number={19}
      name={`${invitation.honoree}, XV, ${invitation.event.day} de ${invitation.event.monthName}`}
      className="lake-scene"
      background={
        <>
          <Particles lanterns />
          <div className="lake-water" aria-hidden="true" />
        </>
      }
    >
      <div className="closing-signature" data-reveal>
        <p className="closing-name">{invitation.honoree}</p>
        <p className="xv-label">XV</p>
        <span className="closing-date">
          {invitation.event.day} <i>·</i> {invitation.event.month}
        </span>
      </div>
    </Scene>
  );
}
