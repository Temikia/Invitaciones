// Navegación interna entre las tres páginas sin recargar el documento,
// para que la música (un único <audio> por encima de las páginas) no se corte.

export const APP_ROUTES = ["/", "/album", "/recuerdos"] as const;
export type AppRoute = (typeof APP_ROUTES)[number];

export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed || "/";
}

export function toAppRoute(pathname: string): AppRoute | null {
  const path = normalizePath(pathname);
  return (APP_ROUTES as readonly string[]).includes(path) ? (path as AppRoute) : null;
}

type ClickLike = {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
};

type AnchorLike = {
  href: string;
  target: string;
  hasAttribute(name: string): boolean;
};

/**
 * Devuelve la URL de destino si el clic debe resolverse dentro de la app;
 * `null` si el navegador debe encargarse (otra pestaña, otro sitio, descarga,
 * ancla en la misma página o una ruta que no es de la app).
 */
export function internalDestination(event: ClickLike, anchor: AnchorLike, current: { origin: string; pathname: string }): URL | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;
  let url: URL;
  try {
    url = new URL(anchor.href, current.origin);
  } catch {
    return null;
  }
  if (url.origin !== current.origin) return null;
  if (!toAppRoute(url.pathname)) return null;
  if (url.hash && normalizePath(url.pathname) === normalizePath(current.pathname)) return null;
  return url;
}
