import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { invitation } from "../../config/invitation";

type MusicState = {
  playing: boolean;
  failed: boolean;
  toggle: () => Promise<void>;
};

const MusicContext = createContext<MusicState | null>(null);

/**
 * Único reproductor de la canción. Vive por encima de las páginas para que
 * la música continúe al pasar entre invitación, álbum y recuerdos.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  // La canción se pausó para dejar oír un video y debe volver cuando este termine.
  const resumeAfterVideo = useRef(false);

  useEffect(() => {
    // Videos con sonido en curso y la escucha propia de cada uno.
    const playingVideos = new Map<HTMLVideoElement, () => void>();
    const EVENTS = ["pause", "ended", "volumechange", "emptied"] as const;
    const audible = (video: HTMLVideoElement) => !video.paused && !video.muted && video.volume > 0;
    const release = (video: HTMLVideoElement) => {
      const stop = playingVideos.get(video);
      if (!stop) return;
      for (const name of EVENTS) video.removeEventListener(name, stop);
      playingVideos.delete(video);
      if (playingVideos.size || !resumeAfterVideo.current) return;
      resumeAfterVideo.current = false;
      audio.current?.play().catch(() => undefined);
    };
    const track = (event: Event) => {
      const video = event.target;
      if (!(video instanceof HTMLVideoElement)) return;
      if (!audible(video)) {
        release(video);
        return;
      }
      if (playingVideos.has(video)) return;
      // Escucha en el propio video: si se retira del documento, su pausa no llega a `document`.
      const stop = () => { if (!audible(video)) release(video); };
      for (const name of EVENTS) video.addEventListener(name, stop);
      playingVideos.set(video, stop);
      const element = audio.current;
      if (element && !element.paused) {
        resumeAfterVideo.current = true;
        element.pause();
      }
    };
    // Los eventos de medios no burbujean: se escuchan en captura.
    document.addEventListener("playing", track, true);
    document.addEventListener("volumechange", track, true);
    return () => {
      document.removeEventListener("playing", track, true);
      document.removeEventListener("volumechange", track, true);
    };
  }, []);

  const toggle = useCallback(async () => {
    const element = audio.current;
    if (!element) return;
    resumeAfterVideo.current = false;
    if (!element.paused) {
      element.pause();
      return;
    }
    try {
      await element.play();
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  const value = useMemo(() => ({ playing, failed, toggle }), [playing, failed, toggle]);

  return <MusicContext.Provider value={value}>
    <audio
      ref={audio}
      src={invitation.audio}
      preload="none"
      loop
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
    />
    {children}
  </MusicContext.Provider>;
}

export function useMusic(): MusicState {
  const value = useContext(MusicContext);
  if (!value) throw new Error("useMusic requiere MusicProvider");
  return value;
}
