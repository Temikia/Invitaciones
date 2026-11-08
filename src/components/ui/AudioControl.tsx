import { useEffect, useLayoutEffect, useRef, useState, type Ref } from "react";
import { createPortal } from "react-dom";
import { Pause, Play } from "lucide-react";
import { useLanguage } from "../../config/language";
import { useMusic } from "./Music";
import "../../styles/audio.css";

function MusicControls({ buttonRef, tabIndex = 0 }: { buttonRef?: Ref<HTMLButtonElement>; tabIndex?: number }) {
  const { t } = useLanguage();
  const { playing, failed, toggle } = useMusic();
  return <>
    <button
      ref={buttonRef}
      type="button"
      className={`audio-button ${playing ? "playing" : ""}`}
      onClick={() => void toggle()}
      tabIndex={tabIndex}
      aria-label={playing ? t("audio.pause") : t("audio.play")}
      aria-pressed={playing}
    >
      {playing ? <Pause size={19} aria-hidden="true" /> : <Play size={19} aria-hidden="true" />}
    </button>
    <span className="audio-caption">
      {playing ? t("audio.caption.playing") : t("audio.caption.idle")}
    </span>
    {failed ? <p role="status">{t("audio.error")}</p> : null}
  </>;
}

/** Control flotante para álbum y recuerdos: la misma música, siempre a mano. */
export function PageAudioControl() {
  const { failed } = useMusic();
  return createPortal(
    <div className={`audio-control audio-control-floating${failed ? " has-error" : ""}`}><MusicControls /></div>,
    document.body,
  );
}

/** Control de la invitación: en la escena 3, flotante al pasarla y oculto desde el lago. */
export function AudioControl() {
  const { failed } = useMusic();
  const inlineControl = useRef<HTMLDivElement>(null);
  const inlineButton = useRef<HTMLButtonElement>(null);
  const floatingButton = useRef<HTMLButtonElement>(null);
  const transferFocus = useRef(false);
  const [passedOriginal, setPassedOriginal] = useState(false);
  const [lakeReached, setLakeReached] = useState(false);
  const floating = passedOriginal && !lakeReached;

  useEffect(() => {
    const original = inlineControl.current;
    if (!original || !window.IntersectionObserver) return;
    const rememberFocus = () => {
      transferFocus.current = (
        document.activeElement === inlineButton.current ||
        document.activeElement === floatingButton.current
      );
    };
    const header = document.querySelector<HTMLElement>(".invitation-header");
    const lake = document.querySelector('[data-scene="19"]');
    let frame = 0;
    const measure = () => {
      frame = 0;
      rememberFocus();
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      setPassedOriginal(original.getBoundingClientRect().bottom <= headerHeight);
      setLakeReached(lake ? lake.getBoundingClientRect().top < window.innerHeight : false);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    // Los saltos de scroll pueden cruzar ambos elementos sin que cambie
    // isIntersecting; medimos una vez por frame para no conservar un estado viejo.
    const observer = new IntersectionObserver(schedule);
    observer.observe(original);
    if (lake) observer.observe(lake);
    const headerObserver = header && window.ResizeObserver
      ? new ResizeObserver(schedule)
      : null;
    if (header) headerObserver?.observe(header);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    measure();
    return () => {
      observer.disconnect();
      headerObserver?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  useLayoutEffect(() => {
    if (!transferFocus.current) return;
    transferFocus.current = false;
    if (floating) floatingButton.current?.focus({ preventScroll: true });
    else if (!lakeReached) inlineButton.current?.focus({ preventScroll: true });
    else if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }, [floating, lakeReached]);

  return <>
    <div
      ref={inlineControl}
      className={`audio-control audio-control-inline${floating || lakeReached ? " audio-control-placeholder" : ""}`}
      aria-hidden={floating || lakeReached || undefined}
    >
      <MusicControls buttonRef={inlineButton} tabIndex={floating || lakeReached ? -1 : 0} />
    </div>
    {floating && createPortal(
      <div className={`audio-control audio-control-floating${failed ? " has-error" : ""}`}><MusicControls buttonRef={floatingButton} /></div>,
      document.body,
    )}
  </>;
}
