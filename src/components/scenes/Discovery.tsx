import { invitation } from "../../config/invitation";
import { Scene, Eyebrow, Divider, Ornament } from "../ui/Atmosphere";
import { AudioControl } from "../ui/AudioControl";

export function Scene01Flower() {
  return (
    <Scene
      number={1}
      name="Una historia comienza"
      className="flower-scene"
    >
      <div className="flower-halo">
        <img
          className="flower-image"
          src="/assets/production/ornaments/flower.webp"
          alt="Una flor dorada ilumina la oscuridad"
          width="480"
          height="720"
          fetchPriority="high"
        />
      </div>
      <p className="opening-line" data-reveal>
        {invitation.messages.opening}
      </p>
      <span className="vertical-thread" aria-hidden="true" />
    </Scene>
  );
}
export function Scene02Camila() {
  return (
    <Scene
      number={2}
      name={`${invitation.honoree}, mis quince años`}
      className="name-scene"
    >
      <Eyebrow>Una nueva luz en mi historia</Eyebrow>
      <h1 data-reveal>{invitation.honoree}</h1>
      <p className="xv-label" data-reveal>
        Mis XV años
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
  return (
    <Scene number={3} name="Nuestra canción" className="music-scene">
      <AudioControl />
    </Scene>
  );
}
export function Scene04Portrait() {
  return (
    <Scene number={4} name="El sueño de Camila" className="portrait-scene">
      <figure className="hero-portrait glowing-frame" data-reveal>
        <div className="frame-glow" aria-hidden="true" />
        <div className="frame-inner">
          <img
            className="cinematic-photo"
            src={invitation.photos.hero}
            alt="Camila con corona y vestido de quince años color lavanda"
            width="1200"
            height="1600"
            loading="lazy"
          />
          <figcaption>
            Quince años de sueños.
            <br />
            <em>Una noche para recordarlos.</em>
          </figcaption>
        </div>
      </figure>
    </Scene>
  );
}
export function Scene05Prayer() {
  return (
    <Scene number={5} name="Gracias a Dios" className="prayer-scene">
      <Eyebrow>Donde nace mi luz</Eyebrow>
      <h2 data-reveal>Gracias, Dios.</h2>
      <p className="reading-copy" data-reveal>
        {invitation.messages.spiritual}
      </p>
    </Scene>
  );
}
export function Scene06Sun() {
  return (
    <Scene number={6} name="La luz que nos une" className="solar-scene">
      <div className="solar-halo">
        <Ornament name="sun" className="solar-symbol" />
      </div>
      <span className="vertical-thread" aria-hidden="true" />
    </Scene>
  );
}
export function Scene07Family() {
  return (
    <Scene number={7} name="Mi familia te invita" className="family-scene">
      <Eyebrow>Con el amor de mis padres</Eyebrow>
      <h2 className="parents" data-reveal>
        {invitation.parents[0]}
        <span>&</span>
        {invitation.parents[1]}
      </h2>
      <Divider />
      <p className="reading-copy" data-reveal>
        {invitation.messages.family}
      </p>
      <p className="serif invitation-line" data-reveal>
        Será un honor celebrar contigo.
      </p>
    </Scene>
  );
}
