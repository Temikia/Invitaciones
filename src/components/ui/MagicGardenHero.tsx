import { useCallback, useEffect, useRef, useState } from "react";
import { invitation } from "../../config/invitation";
import "../../styles/magic-hero.css";

export function MagicGardenHero() {
  const introRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const flowerBtnRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);

  const isReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sparkle = useCallback((x: number, y: number, count = 36) => {
    if (isReducedMotion()) return;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("i");
      el.className = "spark";
      const ang = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const dist = (60 + Math.random() * 140) * (window.innerWidth < 680 ? 0.62 : 1);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty("--dx", `${Math.cos(ang) * dist}px`);
      el.style.setProperty("--dy", `${Math.sin(ang) * dist}px`);
      el.style.setProperty("--dur", `${750 + Math.random() * 750}ms`);
      const w = 2 + Math.random() * 4;
      el.style.width = `${w}px`;
      el.style.height = `${w}px`;
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }
  }, []);

  const bloom = useCallback(() => {
    if (flowerBtnRef.current) {
      const r = flowerBtnRef.current.getBoundingClientRect();
      sparkle(r.left + r.width / 2, r.top + r.height / 2, 36);
    }
    if (artRef.current) {
      artRef.current.classList.remove("highlight");
      void artRef.current.offsetWidth;
      artRef.current.classList.add("highlight");
      if (highlightTimeoutRef.current) window.clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = window.setTimeout(() => {
        artRef.current?.classList.remove("highlight");
      }, 1800);
    }
    setToastVisible(true);
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2800);
  }, [sparkle]);

  const handleDiscover = useCallback(() => {
    bloom();
    const reduce = isReducedMotion();
    window.setTimeout(() => {
      const target =
        document.getElementById("continuar") ||
        document.querySelector<HTMLElement>('[data-scene="2"]');
      target?.scrollIntoView({ behavior: reduce ? "instant" : "smooth" });
    }, 800);
  }, [bloom]);

  // Parallax interactivo del fondo/retrato en desktop
  useEffect(() => {
    if (isReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const intro = introRef.current;
    const art = artRef.current;
    if (!intro || !art) return;

    let queued = false;
    let tx = 0;
    let ty = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const r = intro.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!queued) {
        queued = true;
        requestAnimationFrame(() => {
          art.style.setProperty("--px", `${tx * 20}px`);
          art.style.setProperty("--py", `${ty * 14}px`);
          queued = false;
        });
      }
    };

    const handlePointerLeave = () => {
      art.style.setProperty("--px", "0px");
      art.style.setProperty("--py", "0px");
    };

    intro.addEventListener("pointermove", handlePointerMove, { passive: true });
    intro.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      intro.removeEventListener("pointermove", handlePointerMove);
      intro.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  // Animación del lienzo de neblina dorada y partículas flotantes
  useEffect(() => {
    if (isReducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let running = true;
    let rafId = 0;

    interface Particle {
      x: number;
      y: number;
      r: number;
      v: number;
      o: number;
      phase: number;
    }

    let particles: Particle[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.parentElement?.offsetWidth || window.innerWidth;
      H = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = W < 680 ? 35 : 70;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.45 + 0.25,
        v: Math.random() * 0.23 + 0.06,
        o: Math.random() * 0.42 + 0.1,
        phase: Math.random() * 6.28,
      }));
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    let time = 0;
    const animate = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      time += 0.009;
      for (const p of particles) {
        p.y -= p.v;
        p.x += Math.sin(time + p.phase) * 0.07;
        if (p.y < 0) {
          p.y = H;
          p.x = Math.random() * W;
        }
        const a = p.o * (0.6 + 0.4 * Math.sin(time * 2 + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 201, 136, ${Math.max(0, a)})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const handleVisibility = () => {
      if (document.hidden) {
        running = false;
      } else if (!running) {
        running = true;
        rafId = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
      if (highlightTimeoutRef.current) window.clearTimeout(highlightTimeoutRef.current);
    };
  }, []);

  return (
    <section
      data-scene={1}
      id="inicio"
      ref={introRef}
      aria-label="Una historia comienza · El jardín de los sueños de Camila"
      className="intro magic-hero"
    >
      <div className="hero-noise" aria-hidden="true" />
      <div className="golden-aura" aria-hidden="true" />
      <div className="art" ref={artRef} id="art" aria-hidden="true">
        <img
          className="art-image cinema"
          src={invitation.photos.heroGarden}
          alt="Camila en el jardín encantado"
          width="1536"
          height="614"
          fetchPriority="high"
        />
        <div className="art-dust" />
      </div>
      <div className="halo-rune" aria-hidden="true">
        ✧
      </div>
      <div className="halo-rune two" aria-hidden="true">
        ✦
      </div>
      <div className="frame-top" aria-hidden="true" />

      <header className="magic-hero-header">
        <div className="magic-header-side">EL JARDÍN DE LOS SUEÑOS</div>
        <div className="magic-monogram" aria-label="Camila, quince años">
          C <span className="dot">✧</span> XV
        </div>
        <div className="magic-header-side right">UNA NOCHE PARA RECORDAR</div>
      </header>

      <div className="content">
        <div className="copy">
          <div className="kicker">El comienzo de algo inolvidable</div>
          <h1>
            <span>Hay sueños</span>
            <span>que un día</span>
            <em>florecen.</em>
          </h1>
          <div className="quote-block">
            <p className="quote">
              {invitation.messages.opening}
            </p>
            <div className="sign">— {invitation.honoree}</div>
          </div>
          <div className="actions">
            <button
              className="main-button"
              id="discover"
              type="button"
              onClick={handleDiscover}
            >
              <span>Descubre la magia</span>
              <span className="circle-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
            <span className="mini-hint">
              Hay historias que comienzan con un pequeño destello.
            </span>
          </div>
        </div>
      </div>

      <div className="flower-interaction" id="flower-interaction">
        <button
          type="button"
          ref={flowerBtnRef}
          className="flower-button"
          id="flower-button"
          aria-label="Toca para hacer brillar la flor"
          onClick={bloom}
        >
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 2c1.6 6.4 3.7 9.3 8.1 10.7C19.7 14 17.6 16.9 16 23c-1.6-6.1-3.7-9-8.1-10.3C12.3 11.3 14.4 8.4 16 2Z" />
            <path d="m25.5 22 .8 3.2 3.2.8-3.2.8-.8 3.2-.8-3.2-3.2-.8 3.2-.8.8-3.2Z" />
            <path d="m6.5 19 .6 2.4 2.4.6-2.4.6-.6 2.4-.6-2.4-2.4-.6 2.4-.6.6-2.4Z" />
          </svg>
        </button>
        <span className="flower-label">Toca la luz</span>
      </div>

      <div
        className={`wish-toast${toastVisible ? " visible" : ""}`}
        id="wish-toast"
        role="status"
        aria-live="polite"
      >
        La magia acaba de comenzar ✦
      </div>

      <span className="edition">
        {invitation.honoree.toUpperCase()} · MIS XV AÑOS
      </span>
      <a
        className="scroll-cue"
        href="#continuar"
        aria-label="Deslizar para continuar"
        onClick={(e) => {
          e.preventDefault();
          handleDiscover();
        }}
      >
        DESLIZA PARA SOÑAR
      </a>

      <canvas ref={canvasRef} className="mist-canvas" id="mist-canvas" aria-hidden="true" />
    </section>
  );
}
