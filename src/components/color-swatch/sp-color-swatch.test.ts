import { describe, it, expect, beforeEach } from "vitest";
import "./sp-color-swatch.js";
import type { SpColorSwatchComponent } from "./sp-color-swatch.js";

function createElement(): SpColorSwatchComponent {
  const el = document.createElement("sp-color-swatch") as SpColorSwatchComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-color-swatch", () => {
  let el: SpColorSwatchComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders swatch group in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-sw")).not.toBeNull();
  });

  it("renders a button for each color", async () => {
    el.colors = [{ color: "#ff0000" }, { color: "#00ff00" }, { color: "#0000ff" }];
    await el.updateComplete;
    const btns = el.shadowRoot?.querySelectorAll(".sp-sw-color");
    expect(btns?.length).toBe(3);
  });

  it("fires sp-select on color click", async () => {
    el.colors = [{ color: "#ff0000", label: "Rojo" }];
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-select", (e) => received.push(e as CustomEvent));
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-sw-color");
    btn?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.color.color).toBe("#ff0000");
  });

  it("marks selected color as pressed", async () => {
    el.colors = [{ color: "#ff0000" }];
    el.value = "#ff0000";
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-sw-color");
    expect(btn?.getAttribute("aria-pressed")).toBe("true");
  });

  it("shows check mark when color is selected", async () => {
    el.colors = [{ color: "#ff0000" }];
    el.value = "#ff0000";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-sw-check")).not.toBeNull();
  });

  it("defaults to circle shape", async () => {
    await el.updateComplete;
    expect(el.shape).toBe("circle");
  });

  it("defaults to md size", async () => {
    await el.updateComplete;
    expect(el.size).toBe("md");
  });

  it("shows label when showLabel is true", async () => {
    el.colors = [{ color: "#ff0000", label: "Rojo" }];
    el.showLabel = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-sw-label")?.textContent?.trim()).toBe("Rojo");
  });

  it("does not show label by default", async () => {
    el.colors = [{ color: "#ff0000", label: "Rojo" }];
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-sw-label")).toBeNull();
  });

  it("disabled swatch gets disabled class", async () => {
    el.colors = [{ color: "#ff0000", disabled: true }];
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-sw-color--disabled")).not.toBeNull();
  });
});
