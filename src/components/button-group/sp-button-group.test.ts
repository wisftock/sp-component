import { describe, it, expect, beforeEach } from "vitest";
import "../button/sp-button.js";
import "./sp-button-group.js";
import type { SpButtonGroupComponent } from "./sp-button-group.js";
import type { SpButtonComponent } from "../button/sp-button.js";

function createGroup(): SpButtonGroupComponent {
  const el = document.createElement("sp-button-group") as SpButtonGroupComponent;
  document.body.appendChild(el);
  return el;
}

function addButton(group: SpButtonGroupComponent, label: string): SpButtonComponent {
  const btn = document.createElement("sp-button") as SpButtonComponent;
  btn.textContent = label;
  group.appendChild(btn);
  return btn;
}

describe("sp-button-group", () => {
  let group: SpButtonGroupComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    group = createGroup();
  });

  // ---- Rendering ----

  it("renders group container div in shadow DOM", async () => {
    await group.updateComplete;
    expect(group.shadowRoot?.querySelector(".sp-button-group")).not.toBeNull();
  });

  it("renders slot in shadow DOM", async () => {
    await group.updateComplete;
    expect(group.shadowRoot?.querySelector("slot")).not.toBeNull();
  });

  it('has role="group" on container', async () => {
    await group.updateComplete;
    const container = group.shadowRoot?.querySelector(".sp-button-group");
    expect(container?.getAttribute("role")).toBe("group");
  });

  // ---- Default props ----

  it("reflects default orientation as horizontal", async () => {
    await group.updateComplete;
    expect(group.getAttribute("orientation")).toBe("horizontal");
  });

  it("reflects default size as md", async () => {
    await group.updateComplete;
    expect(group.getAttribute("size")).toBe("md");
  });

  it("is not attached by default", async () => {
    await group.updateComplete;
    expect(group.attached).toBe(false);
    expect(group.hasAttribute("attached")).toBe(false);
  });

  // ---- Reflection ----

  it("reflects orientation horizontal", async () => {
    group.orientation = "horizontal";
    await group.updateComplete;
    expect(group.getAttribute("orientation")).toBe("horizontal");
  });

  it("reflects orientation vertical", async () => {
    group.orientation = "vertical";
    await group.updateComplete;
    expect(group.getAttribute("orientation")).toBe("vertical");
  });

  it("reflects attached attribute when set", async () => {
    group.attached = true;
    await group.updateComplete;
    expect(group.hasAttribute("attached")).toBe(true);
  });

  // ---- CSS classes ----

  it("adds sp-button-group--horizontal class when orientation is horizontal", async () => {
    group.orientation = "horizontal";
    await group.updateComplete;
    const container = group.shadowRoot?.querySelector(".sp-button-group");
    expect(container?.classList.contains("sp-button-group--horizontal")).toBe(true);
  });

  it("adds sp-button-group--vertical class when orientation is vertical", async () => {
    group.orientation = "vertical";
    await group.updateComplete;
    const container = group.shadowRoot?.querySelector(".sp-button-group");
    expect(container?.classList.contains("sp-button-group--vertical")).toBe(true);
  });

  it("adds sp-button-group--attached class when attached is true", async () => {
    group.attached = true;
    await group.updateComplete;
    const container = group.shadowRoot?.querySelector(".sp-button-group");
    expect(container?.classList.contains("sp-button-group--attached")).toBe(true);
  });

  it("does not add sp-button-group--attached class when attached is false", async () => {
    group.attached = false;
    await group.updateComplete;
    const container = group.shadowRoot?.querySelector(".sp-button-group");
    expect(container?.classList.contains("sp-button-group--attached")).toBe(false);
  });

  // ---- Children ----

  it("slotted buttons are queryable from host", async () => {
    addButton(group, "Button 1");
    addButton(group, "Button 2");
    await group.updateComplete;
    const buttons = group.querySelectorAll("sp-button");
    expect(buttons.length).toBe(2);
  });

  it("propagates size to child buttons", async () => {
    const btn = addButton(group, "Click");
    group.size = "lg";
    await group.updateComplete;
    await btn.updateComplete;
    expect(btn.size).toBe("lg");
  });

  it("propagates variant to child buttons", async () => {
    const btn = addButton(group, "Click");
    group.variant = "secondary";
    await group.updateComplete;
    await btn.updateComplete;
    expect(btn.variant).toBe("secondary");
  });
});
