import { describe, expect, it } from "vitest";
import { invitation, galleryChapters } from "../config/invitation";
import { galleryCardState } from "./gallery";

describe("galería circular", () => {
  it("asocia un capítulo a cada una de las siete fotografías", () => {
    expect(invitation.photos.gallery).toHaveLength(7);
    expect(galleryChapters).toHaveLength(invitation.photos.gallery.length);
  });

  it.each([5, 7])("conserva el orden y tres tarjetas accesibles al recorrer %i fotos", total => {
    for (let active = 0; active < total; active++) {
      const states = Array.from({ length: total }, (_, index) => galleryCardState(index, active, total));
      expect(states[active]).toBe("active");
      expect(states[(active + 1) % total]).toBe("next");
      expect(states[(active + total - 1) % total]).toBe("prev");
      expect(states.filter(state => ["active", "next", "prev"].includes(state))).toHaveLength(3);
      expect(states.filter(state => state === "hidden")).toHaveLength(total - 5);
      expect(states).toContain("far-next");
      expect(states).toContain("far-prev");
    }
  });
});
