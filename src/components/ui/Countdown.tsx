import { useEffect, useState } from "react";
import { invitation } from "../../config/invitation";
import { getCountdown } from "../../lib/event";
import { useLanguage } from "../../config/language";

export function Countdown() {
  const { t } = useLanguage();
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
        <p className="serif">{t("countdown.ended")}</p>
      ) : (
        <div
          className="countdown"
          role="timer"
          aria-label={t("countdown.aria")}
        >
          {(["days", "hours", "minutes", "seconds"] as const).map((key, i) => (
            <div key={key}>
              <strong>{String(remaining[key]).padStart(2, "0")}</strong>
              <span>{[t("countdown.days"), t("countdown.hours"), t("countdown.minutes"), t("countdown.seconds")][i]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
