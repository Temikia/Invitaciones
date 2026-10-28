import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export function Scene({
  number,
  name,
  id,
  className = "",
  background,
  children,
}: {
  number: number;
  name: string;
  id?: string;
  className?: string;
  background?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-scene={number}
      aria-label={name}
      className={`scene ${className}`}
    >
      {background}
      <div className="scene-inner">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow" data-reveal>
      {children}
    </p>
  );
}
export function Ornament({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <img
      className={`ornament ${className}`}
      src={`/assets/production/ornaments/${name}.webp`}
      alt=""
      aria-hidden="true"
      loading="lazy"
    />
  );
}
export function Divider() {
  return (
    <span className="divider" aria-hidden="true">
      <i />✦<i />
    </span>
  );
}
export function Atmosphere() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight;
      const progress = (window.scrollY + window.innerHeight / 2) / height;
      const boundary = 2 / 3;
      const fade = 0.18;
      const clamp = (value: number) => Math.min(1, Math.max(0, value));
      layer.current?.style.setProperty("--particles-opacity", String(clamp((boundary - progress) / fade)));
      layer.current?.style.setProperty("--lanterns-opacity", String(clamp((progress - boundary) / fade)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="atmosphere" ref={layer} aria-hidden="true">
      <Particles />
      <Particles lanterns />
    </div>
  );
}

function Particles({ lanterns = false }: { lanterns?: boolean }) {
  return (
    <div
      className={lanterns ? "lantern-field" : "particles"}
      aria-hidden="true"
    >
      {Array.from({ length: lanterns ? 12 : 26 }, (_, i) => (
        <span
          key={i}
          style={
            {
              "--x": `${(i * 37 + 9) % 100}%`,
              "--y": `${(i * 23 + 11) % 90}%`,
              "--delay": `${-i * 1.7}s`,
              "--duration": `${24 + (i % 8) * 2}s`,
              "--size": `${lanterns ? 18 + (i % 5) * 6 : 2 + (i % 3)}px`,
              "--depth": 0.18 + (i % 5) * 0.055,
            } as CSSProperties
          }
        >
          {lanterns ? (
            <img src="/assets/production/ornaments/lantern.webp" alt="" />
          ) : null}
        </span>
      ))}
    </div>
  );
}
