import { describe, expect, it } from "vitest";
import { invitation } from "../config/invitation";
import {
  buildWhatsAppUrl,
  canShowAlbumUpload,
  getCountdown,
  getUploadPhase,
  getNovemberCalendar,
  validateFiles,
} from "./event";

describe("fecha y cuenta regresiva", () => {
  it("fija las 17:00 de Denver en noviembre sin depender de la zona del navegador", () => {
    expect(new Date(invitation.event.iso).toISOString()).toBe(
      "2026-11-23T00:00:00.000Z",
    );
    const denver = new Intl.DateTimeFormat("en-US", {
      timeZone: invitation.event.timezone,
      hour: "numeric",
      hour12: false,
    });
    expect(denver.format(new Date(invitation.event.iso))).toBe("17");
    expect(
      getCountdown(Date.parse("2026-11-21T21:56:56Z"), invitation.event.iso),
    ).toEqual({ days: 1, hours: 2, minutes: 3, seconds: 4 });
  });
  it("llega a cero y permanece ahí", () => {
    for (const now of ["2026-11-23T00:00:00Z", "2026-12-01T00:00:00Z"]) {
      expect(getCountdown(Date.parse(now), invitation.event.iso)).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    }
    expect(() => getCountdown(NaN, invitation.event.iso)).toThrow();
  });
  it("presenta noviembre de 2026 empezando en lunes, con el 22 en domingo", () => {
    const calendar = getNovemberCalendar(2026);
    expect(calendar.slice(0, 7)).toEqual([
      null,
      null,
      null,
      null,
      null,
      null,
      1,
    ]);
    expect(calendar.indexOf(22) % 7).toBe(6);
    expect(calendar.slice(-7)).toEqual([
      30,
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
    expect(calendar.filter((day) => day !== null)).toHaveLength(30);
    expect(getNovemberCalendar(2027).slice(0, 7)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });
});

describe("ventanas de carga de recuerdos", () => {
  const at = (iso: string) => Date.parse(iso);
  it("muestra la cuenta regresiva hasta la hora del evento y abre la carga en ese instante", () => {
    expect(invitation.uploads.opensAt).toBe(invitation.event.iso);
    expect(getUploadPhase(at("2026-11-07T12:00:00-06:00"))).toBe("countdown");
    expect(getUploadPhase(at("2026-11-22T16:59:59-07:00"))).toBe("countdown");
    expect(getUploadPhase(at("2026-11-22T17:00:00-07:00"))).toBe("open");
    expect(getUploadPhase(at("2026-12-06T23:59:59-07:00"))).toBe("open");
    expect(getUploadPhase(at("2026-12-07T00:00:00-07:00"))).toBe("closed");
  });
  it("ofrece el botón del álbum desde 24 horas antes del evento hasta el cierre", () => {
    expect(Date.parse(invitation.event.iso) - Date.parse(invitation.uploads.albumButtonFrom)).toBe(24 * 3600 * 1000);
    expect(canShowAlbumUpload(at("2026-11-21T16:59:59-07:00"))).toBe(false);
    expect(canShowAlbumUpload(at("2026-11-21T17:00:00-07:00"))).toBe(true);
    expect(canShowAlbumUpload(at("2026-11-23T01:00:00-07:00"))).toBe(true);
    expect(canShowAlbumUpload(at("2026-12-07T00:00:00-07:00"))).toBe(false);
  });
  it("rechaza fechas de carga inválidas", () => {
    const schedule = { albumButtonFrom: "x", opensAt: invitation.uploads.opensAt, closesAt: invitation.uploads.closesAt };
    expect(() => getUploadPhase(0, schedule)).toThrow();
    expect(() => canShowAlbumUpload(0, schedule)).toThrow();
  });
});

describe("confirmación por WhatsApp", () => {
  it("conserva acentos y mantiene caracteres de URL dentro del mensaje", () => {
    const url = new URL(
      buildWhatsAppUrl("  María  José & familia?x=1#sí  ", 42),
    );
    expect(url.origin + url.pathname).toBe("https://wa.me/17202369330");
    expect([...url.searchParams.keys()]).toEqual(["text"]);
    expect(url.hash).toBe("");
    expect(url.searchParams.get("text")).toContain(
      "María José & familia?x=1#sí",
    );
    expect(url.searchParams.get("text")).toContain("42 personas en total");
  });
  it("valida nombre y cantidad, sin inventar un máximo", () => {
    for (const name of ["", "   ", "María\nOtra línea", "Nombre\u0000"]) {
      expect(() => buildWhatsAppUrl(name, 1)).toThrow(/nombre/);
    }
    for (const count of [
      0,
      -1,
      1.5,
      NaN,
      Infinity,
      Number.MAX_SAFE_INTEGER + 1,
    ]) {
      expect(() => buildWhatsAppUrl("María", count)).toThrow(/cantidad/);
    }
    expect(
      new URL(buildWhatsAppUrl("María", 1)).searchParams.get("text"),
    ).toContain("1 persona en total");
    expect(() => buildWhatsAppUrl("María", 500)).not.toThrow();
  });
});

describe("archivos de recuerdos", () => {
  const photo = { name: "foto.JPG", type: "image/jpeg", size: 20 * 1024 ** 2 };
  const video = {
    name: "baile.mov",
    type: "video/quicktime",
    size: 400 * 1024 ** 2,
  };
  it("acepta límites exactos y hasta 20 archivos", () => {
    expect(
      validateFiles([
        photo,
        video,
        { name: "iphone.heic", type: "", size: 100 },
      ]),
    ).toEqual([]);
    expect(validateFiles(Array.from({ length: 20 }, () => photo))).toEqual([]);
  });
  it("explica tamaños excedidos y archivos vacíos", () => {
    expect(validateFiles([{ ...photo, size: photo.size + 1 }])[0]).toContain(
      "20 MB por foto",
    );
    expect(validateFiles([{ ...video, size: video.size + 1 }])[0]).toContain(
      "400 MB por video",
    );
    expect(validateFiles([{ ...photo, size: 0 }])[0]).toContain("vacío");
  });
  it("rechaza formatos incompatibles y lotes fuera de los límites", () => {
    expect(validateFiles([{ ...photo, type: "text/html" }])).toHaveLength(1);
    expect(validateFiles([{ ...photo, name: "archivo.exe" }])).toHaveLength(1);
    expect(
      validateFiles([{ ...photo, name: "archivo.constructor" }]),
    ).toHaveLength(1);
    expect(validateFiles(Array.from({ length: 21 }, () => photo))[0]).toContain(
      "20 archivos",
    );
    expect(validateFiles([])[0]).toContain("Selecciona");
  });
});
