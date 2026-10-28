import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { motionStorageKey, resolveMotionMode, type MotionMode } from "../../lib/motion";

const MotionContext = createContext<{
  mode: MotionMode;
  choose: (mode: MotionMode) => void;
} | null>(null);

function savedChoice() {
  try { return localStorage.getItem(motionStorageKey); }
  catch { return null; }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState(savedChoice);
  const [reduced, setReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const mode = resolveMotionMode(choice, reduced);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    const sync = (event: StorageEvent) => {
      if (event.key === motionStorageKey || event.key === null) setChoice(savedChoice());
    };
    media.addEventListener("change", update);
    window.addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function choose(next: MotionMode) {
    setChoice(next);
    try { localStorage.setItem(motionStorageKey, next); }
    catch { /* La elección funciona en esta visita aunque no se pueda guardar. */ }
  }

  return <MotionContext.Provider value={{ mode, choose }}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("Falta el contexto de efectos visuales.");
  return context;
}

export function MotionControl() {
  const { mode, choose } = useMotion();
  return (
    <div className="motion-controls" role="group" aria-label="Efectos visuales">
      <p className="motion-caption">Elige el ambiente de esta historia</p>
      <div className="motion-options">
        {([ ["full", "Completo"], ["gentle", "Suave"], ["paused", "Sin efectos"] ] as const).map(([value, label]) => (
          <button type="button" className="motion-option" key={value} aria-pressed={mode === value} onClick={() => choose(value)}>{label}</button>
        ))}
      </div>
    </div>
  );
}
