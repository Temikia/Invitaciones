import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../config/language";

export function InvitationHeader() {
  const slot = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(entry.intersectionRatio < 1);
    }, { threshold: [0, 1] });
    if (slot.current) observer.observe(slot.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="header-slot" ref={slot} aria-hidden="true" />
      <header className={`invitation-header${scrolled ? " is-scrolled" : ""}`} aria-label={t("header.label")}>
        <div className="opening-mark" aria-hidden="true">C <span>·</span> XV</div>
        <div className="language-switch" role="group" aria-label={t("header.switch")}>
          <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>En</button>
          <span aria-hidden="true">|</span>
          <button type="button" aria-pressed={language === "es"} onClick={() => setLanguage("es")}>Es</button>
        </div>
      </header>
    </>
  );
}
