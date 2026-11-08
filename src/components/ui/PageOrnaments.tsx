import { Particles } from "./Atmosphere";
import "../../styles/pages.css";

/** Partículas doradas y algunas linternas para /recuerdos y /album, sin depender del desplazamiento. */
export function PageAtmosphere() {
  return <div className="atmosphere page-atmosphere" aria-hidden="true">
    <Particles />
    <Particles lanterns count={6} delayStep={4.6} />
  </div>;
}

/** Sol de la invitación con su halo; `divider` lo acompaña de dos hilos dorados. */
export function PageSun({ divider = false }: { divider?: boolean }) {
  return <div className={`page-sun${divider ? " page-sun--divider" : ""}`} aria-hidden="true">
    {divider && <i />}
    <span className="page-sun-halo"><img src="/assets/production/ornaments/sun.webp" alt="" decoding="async" /></span>
    {divider && <i />}
  </div>;
}
