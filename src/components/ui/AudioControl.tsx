import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { invitation } from "../../config/invitation";

export function AudioControl() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
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
  return (
    <div className="audio-control" data-reveal>
      <audio
        ref={audio}
        src={invitation.audio}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        className={`audio-button ${playing ? "playing" : ""}`}
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        aria-pressed={playing}
      >
        {playing ? <Pause size={19} /> : <Play size={19} />}
      </button>
      <span className="audio-caption">
        {playing ? "Una canción para este momento" : "Escuchar nuestra canción"}
      </span>
      {error ? <p role="status">{error}</p> : null}
    </div>
  );
}
