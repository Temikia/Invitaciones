import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useNarrative(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!root.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.from(element, {
            y: 30,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 94%", once: true },
          });
        });
        gsap.fromTo(
          ".flower-image",
          { scale: 0.82, filter: "brightness(0.35)" },
          {
            scale: 1,
            filter: "brightness(1.1)",
            duration: 3.4,
            ease: "power2.out",
          },
        );
        gsap.to(".solar-symbol", {
          rotation: 25,
          ease: "none",
          scrollTrigger: {
            trigger: ".solar-scene",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.utils
          .toArray<HTMLElement>(".cinematic-photo")
          .forEach((photo) =>
            gsap.fromTo(
              photo,
              { scale: 1.06 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: photo,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            ),
          );
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, [root]);
}
