import { useEffect, useState } from "react";

/** Hora actual que se renueva cada `intervalMs`; sirve para abrir o cerrar etapas sin recargar. */
export function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
