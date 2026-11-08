import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
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

  const toggle = useCallback(async () => {
    const element = audio.current;
    if (!element) return;
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
