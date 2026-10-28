import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useNarrative(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!root.current) return;
    const context = gsap.context(() => {
      // Revelado suave con desvanecimiento bidireccional al hacer scroll
      const generalReveals = gsap.utils
        .toArray<HTMLElement>("[data-reveal]")
        .filter(
          (el) =>
            !el.matches(
              ".hero-portrait, .companion-frame, .itinerary li, .date-editorial",
            ),
        );

      generalReveals.forEach((element) => {
        gsap.fromTo(
          element,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              end: "bottom 12%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      // Divisores dorados que se despliegan suavemente
      gsap.utils.toArray<HTMLElement>(".divider").forEach((divider) => {
        gsap.fromTo(
          divider,
          { scaleX: 0.55, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: divider,
              start: "top 88%",
              end: "bottom 12%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      // Flor de bienvenida: apertura inicial y suave fade al descender
      gsap.fromTo(
        ".flower-image",
        { scale: 0.84, filter: "brightness(0.35)", opacity: 0.6 },
        {
          scale: 1,
          filter: "brightness(1.1)",
          opacity: 1,
          duration: 2.8,
          ease: "power2.out",
        },
      );
      gsap.to(".flower-image", {
        y: 35,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: ".flower-scene",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Fecha central: el día 22 y su tipografía editorial
      gsap.utils.toArray<HTMLElement>(".date-editorial").forEach((editorial) => {
        gsap.fromTo(
          editorial,
          { y: 30, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: editorial,
              start: "top 86%",
              end: "bottom 14%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      // Retratos individuales: entrada majestuosa y micro-paralaje
      gsap.utils
        .toArray<HTMLElement>(".hero-portrait, .companion-frame")
        .forEach((frame) => {
          gsap.fromTo(
            frame,
            { y: 32, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: frame,
                start: "top 86%",
                end: "bottom 14%",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        });

      gsap.utils.toArray<HTMLElement>(".cinematic-photo").forEach((photo) => {
        gsap.fromTo(
          photo,
          { scale: 1.05, y: -8 },
          {
            scale: 1.0,
            y: 8,
            ease: "none",
            scrollTrigger: {
              trigger: photo,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      });

      // Sol místico: rotación continua y pulsación con el scroll
      gsap.to(".solar-symbol", {
        rotation: 30,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: ".solar-scene",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Itinerario: cada hito de la noche entra deslizándose con suavidad
      gsap.utils.toArray<HTMLElement>(".itinerary li").forEach((item) => {
        gsap.fromTo(
          item,
          { x: -16, y: 12, opacity: 0 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      // Sobres de regalos: abanico suave
      gsap.fromTo(
        ".envelope",
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.14,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".envelopes",
            start: "top 86%",
            end: "bottom 14%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    }, root);
    return () => context.revert();
  }, [root]);
}
