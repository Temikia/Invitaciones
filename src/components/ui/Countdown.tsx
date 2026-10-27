import { useEffect, useState } from "react";
import { invitation } from "../../config/invitation";
import { getCountdown } from "../../lib/event";

export function Countdown() {
  const [remaining, setRemaining] = useState(() =>
    getCountdown(Date.now(), invitation.event.iso),
  );
  useEffect(() => {
    const id = setInterval(
      () => setRemaining(getCountdown(Date.now(), invitation.event.iso)),
      1000,
    );
    return () => clearInterval(id);
  }, []);
  const ended = Object.values(remaining).every((value) => value === 0);
  return (
    <div data-reveal>
      {ended ? (
        <p className="serif">El gran día ha llegado.</p>
      ) : (
        <div
          className="countdown"
          role="timer"
          aria-label="Tiempo para la celebración"
        >
          {(["days", "hours", "minutes", "seconds"] as const).map((key, i) => (
            <div key={key}>
              <strong>{String(remaining[key]).padStart(2, "0")}</strong>
              <span>{["Días", "Horas", "Minutos", "Segundos"][i]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
