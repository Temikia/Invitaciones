import { useEffect, useLayoutEffect, useState } from "react";
import { internalDestination, normalizePath, toAppRoute, type AppRoute } from "../lib/navigation";

type HistoryState = { scrollY?: number } | null;
type Location = { route: AppRoute; scrollY: number; hash: string; key: number };

const leaveGuards = new Set<() => string>();

function currentRoute(): AppRoute {
  // Cualquier ruta desconocida muestra la invitación, como antes.
  return toAppRoute(window.location.pathname) ?? "/";
}

function confirmLeave(): boolean {
  for (const guard of leaveGuards) {
    if (!window.confirm(guard())) return false;
  }
  return true;
}

function rememberScroll() {
  const state = (history.state as HistoryState) ?? {};
  history.replaceState({ ...state, scrollY: window.scrollY }, "");
}

/**
 * Evita salir de la página (navegación interna o recarga) mientras `message`
 * tenga valor; se usa durante una carga de recuerdos.
 */
export function useLeaveGuard(message: string | null) {
  useEffect(() => {
    if (!message) return;
    const guard = () => message;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    leaveGuards.add(guard);
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      leaveGuards.delete(guard);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [message]);
}

/**
 * Ruta actual de la app. Intercepta los enlaces entre las tres páginas y los
 * botones atrás/adelante para cambiar de página sin recargar el documento, de
 * modo que el reproductor de música (montado una sola vez) siga sonando.
 */
export function useAppRoute(): AppRoute {
  const [location, setLocation] = useState<Location>(() => ({ route: currentRoute(), scrollY: 0, hash: "", key: 0 }));

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    let scrollTimer = 0;
    let shownUrl = window.location.href;

    const onClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const url = internalDestination(event, anchor, window.location);
      if (!url) return;
      event.preventDefault();
      const samePage = normalizePath(url.pathname) === normalizePath(window.location.pathname) && url.search === window.location.search;
      if (samePage) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (!confirmLeave()) return;
      window.clearTimeout(scrollTimer);
      rememberScroll();
      history.pushState({ scrollY: 0 }, "", url.pathname + url.search + url.hash);
      shownUrl = window.location.href;
      setLocation((previous) => ({ route: currentRoute(), scrollY: 0, hash: url.hash, key: previous.key + 1 }));
    };

    const onPopState = (event: PopStateEvent) => {
      if (!confirmLeave()) {
        // El navegador ya cambió la dirección; se devuelve a la página actual.
        history.pushState({ scrollY: window.scrollY }, "", shownUrl);
        return;
      }
      window.clearTimeout(scrollTimer);
      shownUrl = window.location.href;
      const scrollY = (event.state as HistoryState)?.scrollY ?? 0;
      setLocation((previous) => ({ route: currentRoute(), scrollY, hash: "", key: previous.key + 1 }));
    };

    // La posición se guarda al dejar de desplazarse para restaurarla con atrás/adelante.
    const onScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(rememberScroll, 200);
    };

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollTimer);
    };
  }, []);

  useLayoutEffect(() => {
    if (location.key === 0) return;
    const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, location.scrollY);
  }, [location]);

  return location.route;
}
