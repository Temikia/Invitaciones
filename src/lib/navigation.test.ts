import { describe, expect, it } from "vitest";
import { internalDestination, normalizePath, toAppRoute } from "./navigation";

const click = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };
const current = { origin: "https://camila.test", pathname: "/" };
const anchor = (href: string, extra: { target?: string; download?: boolean } = {}) => ({
  href: new URL(href, current.origin).href,
  target: extra.target ?? "",
  hasAttribute: (name: string) => name === "download" && Boolean(extra.download),
});

describe("navegación interna", () => {
  it("normaliza rutas y reconoce solo las tres páginas", () => {
    expect(normalizePath("/album/")).toBe("/album");
    expect(normalizePath("")).toBe("/");
    expect(toAppRoute("/recuerdos/")).toBe("/recuerdos");
    expect(toAppRoute("/album-local")).toBeNull();
    expect(toAppRoute("/api/drive/gallery/index")).toBeNull();
  });

  it("resuelve dentro de la app los enlaces entre páginas", () => {
    expect(internalDestination(click, anchor("/album"), current)?.pathname).toBe("/album");
    expect(internalDestination(click, anchor("/recuerdos"), { ...current, pathname: "/album" })?.pathname).toBe("/recuerdos");
    expect(internalDestination(click, anchor("/"), { ...current, pathname: "/album" })?.pathname).toBe("/");
  });

  it("deja al navegador lo que no es navegación interna simple", () => {
    expect(internalDestination({ ...click, ctrlKey: true }, anchor("/album"), current)).toBeNull();
    expect(internalDestination({ ...click, metaKey: true }, anchor("/album"), current)).toBeNull();
    expect(internalDestination({ ...click, button: 1 }, anchor("/album"), current)).toBeNull();
    expect(internalDestination({ ...click, defaultPrevented: true }, anchor("/album"), current)).toBeNull();
    expect(internalDestination(click, anchor("/album", { target: "_blank" }), current)).toBeNull();
    expect(internalDestination(click, anchor("/album", { download: true }), current)).toBeNull();
    expect(internalDestination(click, anchor("https://maps.google.com/?q=x"), current)).toBeNull();
    expect(internalDestination(click, anchor("/album-local"), current)).toBeNull();
    expect(internalDestination(click, anchor("/#rsvp"), current)).toBeNull();
  });
});
