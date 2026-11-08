import { describe, expect, it } from "vitest";
import type { AlbumFile } from "./albumShow";
import { currentSlide, initialMovieState, isCurrentReady, movieReducer, upcomingSlide, type MovieAction, type MovieState } from "./albumMovie";

const photo = (id: string): AlbumFile => ({ id, name: `${id}.jpg`, type: "image/jpeg", mediaUrl: `/m/${id}`, thumbUrl: `/t/${id}?x=1` });
const video = (id: string): AlbumFile => ({ id, name: `${id}.mp4`, type: "video/mp4", mediaUrl: `/m/${id}` });
const deck = [photo("a"), photo("b"), photo("c"), photo("d")];
const reshuffle = () => [photo("z"), photo("y")];
const run = (state: MovieState, ...actions: MovieAction[]) => actions.reduce(movieReducer, state);
const start = (queue: AlbumFile[] = deck) => run(initialMovieState, { type: "start", queue });
const next: MovieAction = { type: "advance", direction: 1, reshuffle };
const ready = (key: string): MovieAction => ({ type: "ready", key });

describe("estado de la película", () => {
  it("empieza en el primer recuerdo, sin mostrarlo hasta que esté cargado", () => {
    const state = start();
    expect(currentSlide(state)?.key).toBe("0:a");
    expect(isCurrentReady(state)).toBe(false);
    expect(upcomingSlide(state)).toBeNull();
    expect(isCurrentReady(run(state, ready("0:a")))).toBe(true);
  });

  it("precarga la foto siguiente solo cuando la actual ya se ve", () => {
    const state = run(start(), ready("0:a"));
    expect(upcomingSlide(state)?.key).toBe("1:b");
  });

  // Regresión: con una sola «clave precargada», cargar la tercera foto le quitaba el estado listo a
  // la segunda (que ya no vuelve a disparar `load`), la barra se congelaba y la foto anterior reaparecía.
  it("una foto precargada sigue lista aunque después se precargue la siguiente", () => {
    let state = run(start(), ready("0:a"), ready("1:b"), next);
    expect(currentSlide(state)?.key).toBe("1:b");
    expect(isCurrentReady(state)).toBe(true);
    state = run(state, ready("2:c"));
    expect(isCurrentReady(state)).toBe(true);
    state = run(state, next, ready("3:d"));
    expect(currentSlide(state)?.key).toBe("2:c");
    expect(isCurrentReady(state)).toBe(true);
  });

  it("al avanzar, el recuerdo visible queda debajo hasta terminar el fundido", () => {
    let state = run(start(), ready("0:a"), next);
    expect(state.behind?.key).toBe("0:a");
    state = run(state, { type: "faded", key: "1:b" });
    expect(state.behind?.key).toBe("0:a");
    state = run(state, ready("1:b"), { type: "faded", key: "1:b" });
    expect(state.behind).toBeNull();
  });

  it("si se avanza antes de que cargue el nuevo, debajo se conserva lo que se estaba viendo", () => {
    const state = run(start(), ready("0:a"), next, next);
    expect(currentSlide(state)?.key).toBe("2:c");
    expect(state.behind?.key).toBe("0:a");
  });

  it("al saltar a media aparición, debajo sigue la foto que se veía completa", () => {
    const state = run(start(), ready("0:a"), ready("1:b"), next, next);
    expect(currentSlide(state)?.key).toBe("2:c");
    expect(state.behind?.key).toBe("0:a");
  });

  it("un fundido viejo no retira la capa de un avance posterior", () => {
    const state = run(start(), ready("0:a"), ready("1:b"), next, { type: "faded", key: "1:b" }, next, { type: "faded", key: "1:b" });
    expect(state.behind?.key).toBe("1:b");
  });

  it("al terminar la baraja se arma otra y retroceder desde el inicio va al final", () => {
    const end = run(start(), next, next, next, next);
    expect(currentSlide(end)?.key).toBe("4:z");
    const back = run(start(), { type: "advance", direction: -1, reshuffle });
    expect(currentSlide(back)?.key).toBe("1:d");
  });

  it("no precarga videos como capa oculta", () => {
    const state = run(start([photo("a"), video("v")]), ready("0:a"));
    expect(upcomingSlide(state)).toBeNull();
  });

  it("recuerda los recuerdos que fallaron", () => {
    const state = run(start(), ready("0:a"), { type: "failed", key: "1:b" });
    expect(state.failed).toContain("1:b");
  });

  it("conserva un historial acotado de claves", () => {
    let state = start([photo("a")]);
    for (let index = 0; index < 50; index += 1) state = run(state, ready(currentSlide(state)!.key), { type: "advance", direction: 1, reshuffle: () => [photo("a")] });
    expect(state.ready.length).toBeLessThanOrEqual(8);
  });
});
