import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-stepper.js";
import type { SpStepperComponent } from "./sp-stepper.js";

const defaultSteps = [
  { label: "Step 1" },
  { label: "Step 2" },
  { label: "Step 3" },
];

function createElement(): SpStepperComponent {
  const el = document.createElement("sp-stepper") as SpStepperComponent;
  el.steps = [...defaultSteps];
  document.body.appendChild(el);
  return el;
}

describe("sp-stepper", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the correct number of steps", async () => {
    const el = createElement();
    await el.updateComplete;
    const stepEls = el.shadowRoot?.querySelectorAll(".sp-step");
    expect(stepEls?.length).toBe(3);
  });

  it("marks the first step as current when activeStep=0", async () => {
    const el = createElement();
    await el.updateComplete;
    const stepEls = el.shadowRoot?.querySelectorAll(".sp-step");
    expect(stepEls?.[0]?.classList.contains("sp-step--current")).toBe(true);
  });

  it("marks steps before activeStep as complete", async () => {
    const el = createElement();
    el.activeStep = 2;
    await el.updateComplete;
    const stepEls = el.shadowRoot?.querySelectorAll(".sp-step");
    expect(stepEls?.[0]?.classList.contains("sp-step--complete")).toBe(true);
    expect(stepEls?.[1]?.classList.contains("sp-step--complete")).toBe(true);
    expect(stepEls?.[2]?.classList.contains("sp-step--current")).toBe(true);
  });

  it("marks steps after activeStep as upcoming", async () => {
    const el = createElement();
    el.activeStep = 0;
    await el.updateComplete;
    const stepEls = el.shadowRoot?.querySelectorAll(".sp-step");
    expect(stepEls?.[1]?.classList.contains("sp-step--upcoming")).toBe(true);
    expect(stepEls?.[2]?.classList.contains("sp-step--upcoming")).toBe(true);
  });

  it("emits sp-step-change with step index on click", async () => {
    const el = createElement();
    el.activeStep = 2;
    await el.updateComplete;
    let detail: { step: number } | null = null;
    el.addEventListener("sp-step-change", (e) => {
      detail = (e as CustomEvent<{ step: number }>).detail;
    });
    el._handleStepClick(1);
    expect(detail).toEqual({ step: 1 });
  });

  it("linear mode prevents navigating to a future step", async () => {
    const el = createElement();
    el.linear = true;
    el.activeStep = 0;
    await el.updateComplete;
    el._handleStepClick(2);
    expect(el.activeStep).toBe(0);
  });

  it("non-linear mode allows navigating to any step", async () => {
    const el = createElement();
    el.linear = false;
    el.activeStep = 0;
    await el.updateComplete;
    el._handleStepClick(2);
    expect(el.activeStep).toBe(2);
  });

  it("reflects orientation attribute", async () => {
    const el = createElement();
    el.orientation = "vertical";
    await el.updateComplete;
    expect(el.getAttribute("orientation")).toBe("vertical");
  });

  it("uses explicit error status on a step", async () => {
    const el = document.createElement("sp-stepper") as SpStepperComponent;
    el.steps = [
      { label: "Step 1" },
      { label: "Step 2", status: "error" },
      { label: "Step 3" },
    ];
    document.body.appendChild(el);
    await el.updateComplete;
    const stepEls = el.shadowRoot?.querySelectorAll(".sp-step");
    expect(stepEls?.[1]?.classList.contains("sp-step--error")).toBe(true);
  });

  it("renders step labels correctly", async () => {
    const el = createElement();
    await el.updateComplete;
    const labels = el.shadowRoot?.querySelectorAll(".sp-step-label");
    expect(labels?.[0]?.textContent?.trim()).toBe("Step 1");
    expect(labels?.[1]?.textContent?.trim()).toBe("Step 2");
    expect(labels?.[2]?.textContent?.trim()).toBe("Step 3");
  });

  it("renders step description when provided", async () => {
    const el = document.createElement("sp-stepper") as SpStepperComponent;
    el.steps = [{ label: "Step 1", description: "First description" }];
    document.body.appendChild(el);
    await el.updateComplete;
    const desc = el.shadowRoot?.querySelector(".sp-step-description");
    expect(desc?.textContent?.trim()).toBe("First description");
  });

  it("does not render connector after last step", async () => {
    const el = createElement();
    await el.updateComplete;
    const steps = el.shadowRoot?.querySelectorAll(".sp-step");
    const lastStep = steps?.[steps.length - 1];
    expect(lastStep?.querySelector(".sp-step-connector")).toBeNull();
  });
});
