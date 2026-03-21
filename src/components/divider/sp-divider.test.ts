import { describe, it, expect, beforeEach } from "vitest";
import "./sp-divider.js";
import type { SpDividerComponent } from "./sp-divider.js";

function createElement(): SpDividerComponent {
  const el = document.createElement("sp-divider") as SpDividerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-divider", () => {
  let el: SpDividerComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a .sp-divider div in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-divider")).not.toBeNull();
  });

  it("renders with role='separator'", async () => {
    await el.updateComplete;
    const divider = el.shadowRoot?.querySelector(".sp-divider");
    expect(divider?.getAttribute("role")).toBe("separator");
  });

  it("sets aria-orientation to 'horizontal' by default", async () => {
    await el.updateComplete;
    const divider = el.shadowRoot?.querySelector(".sp-divider");
    expect(divider?.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("sets aria-orientation to 'vertical' when orientation is vertical", async () => {
    el.orientation = "vertical";
    await el.updateComplete;
    const divider = el.shadowRoot?.querySelector(".sp-divider");
    expect(divider?.getAttribute("aria-orientation")).toBe("vertical");
  });

  // ---- Orientation reflection ----

  it("reflects default orientation attribute as 'horizontal'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("orientation")).toBe("horizontal");
  });

  it("reflects orientation attribute when changed to 'vertical'", async () => {
    el.orientation = "vertical";
    await el.updateComplete;
    expect(el.getAttribute("orientation")).toBe("vertical");
  });

  // ---- Variant reflection ----

  it("reflects default variant attribute as 'solid'", async () => {
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("solid");
  });

  it("reflects variant attribute when changed to 'dashed'", async () => {
    el.variant = "dashed";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("dashed");
  });

  it("reflects variant attribute when changed to 'dotted'", async () => {
    el.variant = "dotted";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("dotted");
  });

  // ---- Label ----

  it("does not render label element when label is empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-divider-label")).toBeNull();
  });

  it("renders .sp-divider-label when label is provided", async () => {
    el.label = "OR";
    await el.updateComplete;
    const labelEl = el.shadowRoot?.querySelector(".sp-divider-label");
    expect(labelEl).not.toBeNull();
    expect(labelEl?.textContent?.trim()).toBe("OR");
  });

  it("renders two .sp-divider-line elements when label is set", async () => {
    el.label = "Section";
    await el.updateComplete;
    const lines = el.shadowRoot?.querySelectorAll(".sp-divider-line");
    expect(lines?.length).toBe(2);
  });

  it("renders one .sp-divider-line element when no label", async () => {
    await el.updateComplete;
    const lines = el.shadowRoot?.querySelectorAll(".sp-divider-line");
    expect(lines?.length).toBe(1);
  });
});
