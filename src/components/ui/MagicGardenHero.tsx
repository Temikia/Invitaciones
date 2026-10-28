import { useCallback, useEffect, useRef } from "react";
import { invitation } from "../../config/invitation";
import "../../styles/magic-hero.css";

export function MagicGardenHero() {
  const introRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sparkle = useCallback((x: number, y: number, count = 28) => {
    if (isReducedMotion()) return;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("i");
      el.className = "spark";
      const ang = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const dist = (50 + Math.random() * 120) * (window.innerWidth < 680 ? 0.65 : 1);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty("--dx", `${Math.cos(ang) * dist}px`);
      el.style.setProperty("--dy", `${Math.sin(ang) * dist}px`);
      el.style.setProperty("--dur", `${750 + Math.random() * 750}ms`);
      const w = 2 + Math.random() * 3.5;
      el.style.width = `${w}px`;
      el.style.height = `${w}px`;
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }
  }, []);

  // Acción de la flor fija en bucle, en automático
  useEffect(() => {
    if (isReducedMotion()) return;

    let highlightTimer: number | null = null;

    const triggerBloom = () => {
      if (document.hidden) return;
      if (!artRef.current) return;

      artRef.current.classList.remove("highlight");
      void artRef.current.offsetWidth;
      artRef.current.classList.add("highlight");

      if (highlightTimer) window.clearTimeout(highlightTimer);
      highlightTimer = window.setTimeout(() => {
        artRef.current?.classList.remove("highlight");
      }, 1800);

      const rect = artRef.current.getBoundingClientRect();
      // El destello brota del núcleo de la flor en la pintura (54% horizontal, 38% vertical)
      const flowerX = rect.left + rect.width * 0.54;
      const flowerY = rect.top + rect.height * 0.38;
      sparkle(flowerX, flowerY, 26);
    };

    // Primer destello suave al cargar
    const initialDelay = window.setTimeout(triggerBloom, 800);
    // Bucle continuo automático
    const interval = window.setInterval(triggerBloom, 4000);

    return () => {
      window.clearTimeout(initialDelay);
      window.clearInterval(interval);
      if (highlightTimer) window.clearTimeout(highlightTimer);
    };
  }, [sparkle]);

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

      <div className="content">
        <div className="copy">
          <div className="kicker">El comienzo de algo inolvidable</div>
          <h1>
            <span>Hay sueños</span>
            <span>que un día</span>
            <em>florecen.</em>
          </h1>
          <div className="quote-block">
            <p className="quote">{invitation.messages.opening}</p>
            <div className="sign">— {invitation.honoree}</div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="mist-canvas" id="mist-canvas" aria-hidden="true" />
    </section>
  );
}
