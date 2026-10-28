import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Pause, Play } from "lucide-react";
import { invitation } from "../../config/invitation";
import "../../styles/audio.css";

export function AudioControl() {
  const audio = useRef<HTMLAudioElement>(null);
  const inlineControl = useRef<HTMLDivElement>(null);
  const inlineButton = useRef<HTMLButtonElement>(null);
  const floatingButton = useRef<HTMLButtonElement>(null);
  const transferFocus = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
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

  async function toggle() {
    const element = audio.current;
    if (!element) return;
    if (!element.paused) {
      element.pause();
      return;
    }
    try {
      await element.play();
      setError("");
    } catch {
      setError(
        "No pudimos reproducir la canción. Puedes continuar disfrutando la invitación.",
      );
    }
  }
  function controls(isFloating: boolean) {
    return <>
      <button
        ref={isFloating ? floatingButton : inlineButton}
        className={`audio-button ${playing ? "playing" : ""}`}
        onClick={toggle}
        tabIndex={!isFloating && (floating || lakeReached) ? -1 : 0}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        aria-pressed={playing}
      >
        {playing ? <Pause size={19} aria-hidden="true" /> : <Play size={19} aria-hidden="true" />}
      </button>
      <span className="audio-caption">
        {playing ? "Una canción para este momento" : "Escuchar nuestra canción"}
      </span>
      {error ? <p role="status">{error}</p> : null}
    </>;
  }

  return <>
    <div
      ref={inlineControl}
      className={`audio-control audio-control-inline${floating || lakeReached ? " audio-control-placeholder" : ""}`}
      aria-hidden={floating || lakeReached || undefined}
    >
      <audio
        ref={audio}
        src={invitation.audio}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {controls(false)}
    </div>
    {floating && createPortal(
      <div className={`audio-control audio-control-floating${error ? " has-error" : ""}`}>{controls(true)}</div>,
      document.body,
    )}
  </>;
}
