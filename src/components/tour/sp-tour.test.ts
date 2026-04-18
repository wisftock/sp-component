import { describe, it, expect, beforeEach } from "vitest";
import "./sp-tour.js";
import type { SpTourComponent } from "./sp-tour.js";

function createElement(): SpTourComponent {
  const el = document.createElement("sp-tour") as SpTourComponent;
  document.body.appendChild(el);
  return el;
}

const STEPS = [
  { target: "#step-1", title: "Paso 1", content: "Descripción del paso 1" },
  { target: "#step-2", title: "Paso 2", content: "Descripción del paso 2" },
];

describe("sp-tour", () => {
  let el: SpTourComponent;
  beforeEach(() => {
    document.body.innerHTML = "";
    // Add target elements for the tour steps
    const t1 = document.createElement("button");
    t1.id = "step-1";
    t1.textContent = "Botón 1";
    document.body.appendChild(t1);
    const t2 = document.createElement("button");
    t2.id = "step-2";
    t2.textContent = "Botón 2";
    document.body.appendChild(t2);
    el = createElement();
  });

  it("renders nothing when inactive", async () => {
    el.steps = STEPS;
    el.active = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tour-tooltip")).toBeNull();
  });

  it("renders tooltip when active", async () => {
    el.steps = STEPS;
    el.active = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tour-tooltip")).not.toBeNull();
  });

  it("shows current step content", async () => {
    el.steps = STEPS;
    el.active = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tour-body")?.textContent?.trim()).toBe("Descripción del paso 1");
  });

  it("renders step dots", async () => {
    el.steps = STEPS;
    el.active = true;
    await el.updateComplete;
    const dots = el.shadowRoot?.querySelectorAll(".sp-tour-dot");
    expect(dots?.length).toBe(2);
  });

  it("advances step on next button click", async () => {
    el.steps = STEPS;
    el.active = true;
    await el.updateComplete;
    const nextBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-tour-btn--primary");
    nextBtn?.click();
    await el.updateComplete;
    expect(el.step).toBe(1);
  });

  it("fires sp-step-change on next click", async () => {
    el.steps = STEPS;
    el.active = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-step-change", (e) => received.push(e as CustomEvent));
    const nextBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-tour-btn--primary");
    nextBtn?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.step).toBe(1);
  });

  it("fires sp-finish on last step next click", async () => {
    el.steps = STEPS;
    el.active = true;
    el.step = 1; // last step
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-finish", (e) => received.push(e as CustomEvent));
    const nextBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-tour-btn--primary");
    nextBtn?.click();
    expect(received.length).toBe(1);
  });

  it("fires sp-skip when close is clicked", async () => {
    el.steps = STEPS;
    el.active = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-skip", (e) => received.push(e as CustomEvent));
    const closeBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-tour-close");
    closeBtn?.click();
    expect(received.length).toBe(1);
  });
});
