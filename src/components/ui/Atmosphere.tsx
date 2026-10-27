import type { CSSProperties, ReactNode } from "react";

export function Scene({
  number,
  name,
  className = "",
  background,
  children,
}: {
  number: number;
  name: string;
  className?: string;
  background?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
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
export function Particles({ lanterns = false }: { lanterns?: boolean }) {
  return (
    <div
      className={lanterns ? "lantern-field" : "particles"}
      aria-hidden="true"
    >
      {Array.from({ length: lanterns ? 16 : 26 }, (_, i) => (
        <span
          key={i}
          style={
            {
              "--x": `${(i * 37 + 9) % 100}%`,
              "--delay": `${-i * 1.7}s`,
              "--duration": `${12 + (i % 8)}s`,
              "--size": `${lanterns ? 20 + (i % 5) * 9 : 2 + (i % 3)}px`,
              "--depth": 0.3 + (i % 5) * 0.14,
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
