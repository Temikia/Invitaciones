import { useEffect, useRef, useState } from "react";

export function InvitationHeader() {
  const slot = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

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
      <header className={`invitation-header${scrolled ? " is-scrolled" : ""}`} aria-label="Invitación de Camila, mis quince años">
        <div className="opening-mark" aria-hidden="true">C <span>·</span> XV</div>
      </header>
    </>
  );
}
