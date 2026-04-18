import { describe, it, expect, beforeEach } from "vitest";
import "./sp-onboarding.js";
import type { SpOnboardingComponent } from "./sp-onboarding.js";

function createElement(): SpOnboardingComponent {
  const el = document.createElement("sp-onboarding") as SpOnboardingComponent;
  document.body.appendChild(el);
  return el;
}

const STEPS = [
  { title: "Bienvenido", description: "Paso 1 de la guía", icon: "👋" },
  { title: "Configura", description: "Paso 2 de la guía" },
  { title: "Listo", description: "Paso 3, ya terminaste" },
];

describe("sp-onboarding", () => {
  let el: SpOnboardingComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders nothing when closed", async () => {
    el.steps = STEPS;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ob-modal")).toBeNull();
  });

  it("renders modal when open with steps", async () => {
    el.steps = STEPS;
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ob-modal")).not.toBeNull();
  });

  it("shows first step title", async () => {
    el.steps = STEPS;
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ob-title")?.textContent?.trim()).toBe("Bienvenido");
  });

  it("renders progress dots for each step", async () => {
    el.steps = STEPS;
    el.open = true;
    await el.updateComplete;
    const dots = el.shadowRoot?.querySelectorAll(".sp-ob-dot");
    expect(dots?.length).toBe(3);
  });

  it("advances to next step on next click", async () => {
    el.steps = STEPS;
    el.open = true;
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-ob-btn--primary");
    btn?.click();
    await el.updateComplete;
    expect(el.step).toBe(1);
    expect(el.shadowRoot?.querySelector(".sp-ob-title")?.textContent?.trim()).toBe("Configura");
  });

  it("fires sp-step event on step change", async () => {
    el.steps = STEPS;
    el.open = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-step", (e) => received.push(e as CustomEvent));
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-ob-btn--primary");
    btn?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.step).toBe(1);
  });

  it("fires sp-finish on last step next click", async () => {
    el.steps = STEPS;
    el.open = true;
    el.step = 2; // last step
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-finish", (e) => received.push(e as CustomEvent));
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-ob-btn--primary");
    btn?.click();
    expect(received.length).toBe(1);
  });

  it("fires sp-skip when skip is clicked", async () => {
    el.steps = STEPS;
    el.open = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-skip", (e) => received.push(e as CustomEvent));
    const skipBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-ob-skip");
    skipBtn?.click();
    expect(received.length).toBe(1);
  });
});
