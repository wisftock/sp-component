import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-audio-player.js";
import type { SpAudioPlayerComponent } from "./sp-audio-player.js";

function createElement(): SpAudioPlayerComponent {
  const el = document.createElement("sp-audio-player") as SpAudioPlayerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-audio-player", () => {
  let el: SpAudioPlayerComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renderiza el contenedor principal sp-audio", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-audio")).not.toBeNull();
  });

  it("renderiza el elemento <audio> en el shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("audio")).not.toBeNull();
  });

  it("tiene src vacío por defecto", async () => {
    await el.updateComplete;
    expect(el.src).toBe("");
  });

  it("refleja la prop src en el elemento <audio>", async () => {
    el.src = "https://example.com/audio.mp3";
    await el.updateComplete;
    const audio = el.shadowRoot?.querySelector("audio");
    expect(audio?.getAttribute("src")).toBe("https://example.com/audio.mp3");
  });

  it("muestra el título cuando se establece title", async () => {
    el.title = "Mi canción";
    await el.updateComplete;
    const titleEl = el.shadowRoot?.querySelector(".sp-audio-title");
    expect(titleEl?.textContent?.trim()).toBe("Mi canción");
  });

  it("muestra el artista cuando se establece artist", async () => {
    el.artist = "Mi artista";
    await el.updateComplete;
    const artistEl = el.shadowRoot?.querySelector(".sp-audio-artist");
    expect(artistEl?.textContent?.trim()).toBe("Mi artista");
  });

  it("no muestra info cuando title y artist están vacíos", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-audio-info")).toBeNull();
  });

  it("muestra imagen de portada cuando se establece cover", async () => {
    el.cover = "https://example.com/cover.jpg";
    el.title = "Mi canción";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector(".sp-audio-cover img");
    expect(img?.getAttribute("src")).toBe("https://example.com/cover.jpg");
  });

  it("muestra SVG por defecto cuando no hay cover", async () => {
    await el.updateComplete;
    const svg = el.shadowRoot?.querySelector(".sp-audio-cover svg");
    expect(svg).not.toBeNull();
  });

  it("renderiza el botón de play/pause", async () => {
    await el.updateComplete;
    const playBtn = el.shadowRoot?.querySelector(".sp-audio-btn--play");
    expect(playBtn).not.toBeNull();
  });

  it("llama a audio.play() cuando se hace click en play estando pausado", async () => {
    await el.updateComplete;
    const audio = el.shadowRoot?.querySelector("audio") as HTMLAudioElement;
    const playSpy = vi.spyOn(audio, "play").mockResolvedValue(undefined);
    const playBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-audio-btn--play")!;
    playBtn.click();
    expect(playSpy).toHaveBeenCalledOnce();
  });

  it("llama a audio.pause() cuando se hace click en pause estando reproduciendo", async () => {
    await el.updateComplete;
    const audio = el.shadowRoot?.querySelector("audio") as HTMLAudioElement;
    // Simular estado playing
    audio.dispatchEvent(new Event("play"));
    await el.updateComplete;
    const pauseSpy = vi.spyOn(audio, "pause");
    const playBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-audio-btn--play")!;
    playBtn.click();
    expect(pauseSpy).toHaveBeenCalledOnce();
  });

  it("actualiza _playing a true cuando el audio emite 'play'", async () => {
    await el.updateComplete;
    const audio = el.shadowRoot?.querySelector("audio") as HTMLAudioElement;
    audio.dispatchEvent(new Event("play"));
    await el.updateComplete;
    // El botón de play debe mostrar el ícono de pausa (dos rectángulos)
    const playBtn = el.shadowRoot?.querySelector(".sp-audio-btn--play");
    expect(playBtn?.querySelector("rect")).not.toBeNull();
  });

  it("actualiza _playing a false cuando el audio emite 'pause'", async () => {
    await el.updateComplete;
    const audio = el.shadowRoot?.querySelector("audio") as HTMLAudioElement;
    audio.dispatchEvent(new Event("play"));
    await el.updateComplete;
    audio.dispatchEvent(new Event("pause"));
    await el.updateComplete;
    // El botón de play debe mostrar el ícono de play (polígono)
    const playBtn = el.shadowRoot?.querySelector(".sp-audio-btn--play");
    expect(playBtn?.querySelector("polygon")).not.toBeNull();
  });

  it("renderiza el slider de seek", async () => {
    await el.updateComplete;
    const seek = el.shadowRoot?.querySelector(".sp-audio-seek");
    expect(seek).not.toBeNull();
  });

  it("renderiza el slider de volumen", async () => {
    await el.updateComplete;
    const vol = el.shadowRoot?.querySelector(".sp-audio-volume-slider");
    expect(vol).not.toBeNull();
  });

  it("renderiza el botón de velocidad con valor por defecto 1×", async () => {
    await el.updateComplete;
    const speedBtn = el.shadowRoot?.querySelector(".sp-audio-speed");
    expect(speedBtn?.textContent?.trim()).toBe("1×");
  });

  it("cicla la velocidad al hacer click en el botón de velocidad", async () => {
    await el.updateComplete;
    const audio = el.shadowRoot?.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "playbackRate", { writable: true, value: 1 });
    const speedBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-audio-speed")!;
    // Índice inicial es 2 (1×). Siguiente: índice 3 (1.25×)
    speedBtn.click();
    await el.updateComplete;
    expect(speedBtn.textContent?.trim()).toBe("1.25×");
  });

  it("cicla la velocidad a través de todos los valores disponibles", async () => {
    await el.updateComplete;
    const audio = el.shadowRoot?.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "playbackRate", { writable: true, value: 1 });
    const speedBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-audio-speed")!;
    const expectedSpeeds = ["1.25×", "1.5×", "2×", "0.5×", "0.75×", "1×"];
    for (const expected of expectedSpeeds) {
      speedBtn.click();
      await el.updateComplete;
      expect(speedBtn.textContent?.trim()).toBe(expected);
    }
  });

  it("refleja el atributo autoplay cuando se establece", async () => {
    el.autoplay = true;
    await el.updateComplete;
    const audio = el.shadowRoot?.querySelector("audio");
    expect(audio?.hasAttribute("autoplay")).toBe(true);
  });

  it("refleja el atributo loop cuando se establece", async () => {
    el.loop = true;
    await el.updateComplete;
    const audio = el.shadowRoot?.querySelector("audio");
    expect(audio?.hasAttribute("loop")).toBe(true);
  });

  it("muestra tiempo 0:00 por defecto", async () => {
    await el.updateComplete;
    const timeSpans = el.shadowRoot?.querySelectorAll(".sp-audio-time span");
    expect(timeSpans?.[0]?.textContent?.trim()).toBe("0:00");
    expect(timeSpans?.[1]?.textContent?.trim()).toBe("0:00");
  });

  it("muestra botones de salto ±10s", async () => {
    await el.updateComplete;
    const btns = el.shadowRoot?.querySelectorAll(".sp-audio-btn");
    // hay 4 btns: skip-10, play, skip+10, mute
    expect(btns?.length).toBeGreaterThanOrEqual(3);
  });

  it("establece audio.muted al hacer click en el botón de mute", async () => {
    await el.updateComplete;
    const audio = el.shadowRoot?.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "muted", { writable: true, value: false });
    // Botón mute: cuarto botón (índice 3) dentro de sp-audio-volume
    const muteBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-audio-volume .sp-audio-btn")!;
    muteBtn.click();
    await el.updateComplete;
    expect(audio.muted).toBe(true);
  });
});
