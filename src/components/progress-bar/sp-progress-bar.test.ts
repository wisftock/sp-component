import { describe, it, expect, beforeEach } from "vitest";
import "./sp-progress-bar.js";
import type { SpProgressBarComponent } from "./sp-progress-bar.js";

function createElement(): SpProgressBarComponent {
  const el = document.createElement("sp-progress-bar") as SpProgressBarComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-progress-bar", () => {
  let el: SpProgressBarComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders the progress track", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-progress-track")).not.toBeNull();
  });

  it("renders the progress fill", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-progress-fill")).not.toBeNull();
  });

  // ---- Width calculation ----

  it("sets fill width to 50% when value=50", async () => {
    el.value = 50;
    await el.updateComplete;
    const fill = el.shadowRoot?.querySelector<HTMLElement>(".sp-progress-fill");
    expect(fill?.getAttribute("style")).toContain("50%");
  });

  it("sets fill width to 0% when value=0", async () => {
    el.value = 0;
    await el.updateComplete;
    const fill = el.shadowRoot?.querySelector<HTMLElement>(".sp-progress-fill");
    expect(fill?.getAttribute("style")).toContain("0%");
  });

  it("sets fill width to 100% when value=100", async () => {
    el.value = 100;
    await el.updateComplete;
    const fill = el.shadowRoot?.querySelector<HTMLElement>(".sp-progress-fill");
    expect(fill?.getAttribute("style")).toContain("100%");
  });

  // ---- Indeterminate ----

  it("adds indeterminate class when indeterminate=true", async () => {
    el.indeterminate = true;
    await el.updateComplete;
    const fill = el.shadowRoot?.querySelector(".sp-progress-fill");
    expect(fill?.classList.contains("sp-progress-fill--indeterminate")).toBe(true);
  });

  it("does not add indeterminate class when indeterminate=false", async () => {
    el.indeterminate = false;
    await el.updateComplete;
    const fill = el.shadowRoot?.querySelector(".sp-progress-fill");
    expect(fill?.classList.contains("sp-progress-fill--indeterminate")).toBe(false);
  });

  it("reflects indeterminate attribute", async () => {
    el.indeterminate = true;
    await el.updateComplete;
    expect(el.hasAttribute("indeterminate")).toBe(true);
  });

  // ---- Variant ----

  it("reflects default variant=primary attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("primary");
  });

  it("reflects variant=success attribute", async () => {
    el.variant = "success";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("success");
  });

  it("reflects variant=warning attribute", async () => {
    el.variant = "warning";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("warning");
  });

  it("reflects variant=danger attribute", async () => {
    el.variant = "danger";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("danger");
  });

  // ---- Label ----

  it("shows label element when label prop is set", async () => {
    el.label = "Uploading";
    await el.updateComplete;
    const labelEl = el.shadowRoot?.querySelector(".sp-progress-label");
    expect(labelEl).not.toBeNull();
    expect(labelEl?.textContent).toBe("Uploading");
  });

  it("does not render label element when label is empty", async () => {
    el.label = "";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-progress-label")).toBeNull();
  });

  // ---- Show value ----

  it("shows percentage when showValue=true and not indeterminate", async () => {
    el.value = 75;
    el.showValue = true;
    await el.updateComplete;
    const valEl = el.shadowRoot?.querySelector(".sp-progress-value");
    expect(valEl).not.toBeNull();
    expect(valEl?.textContent).toBe("75%");
  });

  it("does not show percentage when showValue=false", async () => {
    el.value = 75;
    el.showValue = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-progress-value")).toBeNull();
  });

  it("does not show percentage when indeterminate even if showValue=true", async () => {
    el.showValue = true;
    el.indeterminate = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-progress-value")).toBeNull();
  });

  // ---- ARIA ----

  it("has role=progressbar on the track", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("[role='progressbar']")).not.toBeNull();
  });

  it("sets aria-valuenow matching value when not indeterminate", async () => {
    el.value = 40;
    await el.updateComplete;
    const track = el.shadowRoot?.querySelector(".sp-progress-track");
    expect(track?.getAttribute("aria-valuenow")).toBe("40");
  });
});
