import { describe, it, expect, beforeEach } from "vitest";
import "./sp-video-player.js";
import type { SpVideoPlayerComponent } from "./sp-video-player.js";

function createElement(): SpVideoPlayerComponent {
  const el = document.createElement("sp-video-player") as SpVideoPlayerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-video-player", () => {
  let el: SpVideoPlayerComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders video container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-video")).not.toBeNull();
  });

  it("renders video element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("video")).not.toBeNull();
  });

  it("renders controls bar", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-video-controls")).not.toBeNull();
  });

  it("renders play/pause button", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-video-btn")).not.toBeNull();
  });

  it("sets src on video element", async () => {
    el.src = "video.mp4";
    await el.updateComplete;
    const video = el.shadowRoot?.querySelector<HTMLVideoElement>("video");
    expect(video?.src).toContain("video.mp4");
  });

  it("sets poster on video element", async () => {
    el.poster = "poster.jpg";
    await el.updateComplete;
    const video = el.shadowRoot?.querySelector<HTMLVideoElement>("video");
    expect(video?.getAttribute("poster")).toContain("poster.jpg");
  });

  it("defaults autoplay to false", async () => {
    await el.updateComplete;
    expect(el.autoplay).toBe(false);
  });

  it("renders mute button", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-video-vol-group .sp-video-btn")).not.toBeNull();
  });

  it("renders speed button", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-video-speed")).not.toBeNull();
  });

  it("renders progress/seek area", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-video-seek")).not.toBeNull();
  });
});
