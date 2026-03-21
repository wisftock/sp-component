import { describe, it, expect, beforeEach } from "vitest";
import "./sp-alert.js";
import type { SpAlertComponent } from "./sp-alert.js";

function createElement(): SpAlertComponent {
  const el = document.createElement("sp-alert") as SpAlertComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-alert", () => {
  let el: SpAlertComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Visibility ----

  it("renders alert div when open=true", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-alert")).not.toBeNull();
  });

  it("does not render alert div when open=false", async () => {
    el.open = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-alert")).toBeNull();
  });

  // ---- Default props ----

  it("defaults to open=true", async () => {
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(el.hasAttribute("open")).toBe(true);
  });

  it("defaults to variant=info and reflects attribute", async () => {
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("info");
  });

  // ---- Variant reflection ----

  it("reflects variant attribute when changed", async () => {
    el.variant = "success";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("success");
  });

  it("reflects variant=warning attribute", async () => {
    el.variant = "warning";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("warning");
  });

  it("reflects variant=error attribute", async () => {
    el.variant = "error";
    await el.updateComplete;
    expect(el.getAttribute("variant")).toBe("error");
  });

  it("renders .sp-alert div for all 4 variants", async () => {
    for (const variant of ["info", "success", "warning", "error"] as const) {
      el.variant = variant;
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector(".sp-alert")).not.toBeNull();
    }
  });

  // ---- Title ----

  it("shows title element when title prop is set", async () => {
    el.title = "Important!";
    await el.updateComplete;
    const titleEl = el.shadowRoot?.querySelector(".sp-alert-title");
    expect(titleEl).not.toBeNull();
    expect(titleEl?.textContent).toBe("Important!");
  });

  it("does not render title element when title is empty", async () => {
    el.title = "";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-alert-title")).toBeNull();
  });

  // ---- Dismissible ----

  it("does not show close button when dismissible=false", async () => {
    el.dismissible = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-alert-close")).toBeNull();
  });

  it("shows close button when dismissible=true", async () => {
    el.dismissible = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-alert-close")).not.toBeNull();
  });

  it("reflects dismissible attribute", async () => {
    el.dismissible = true;
    await el.updateComplete;
    expect(el.hasAttribute("dismissible")).toBe(true);
  });

  // ---- Close button behavior ----

  it("sets open=false when close button is clicked", async () => {
    el.dismissible = true;
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-alert-close");
    btn?.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it("emits sp-close event when close button is clicked", async () => {
    el.dismissible = true;
    await el.updateComplete;
    let fired = false;
    el.addEventListener("sp-close", () => { fired = true; });
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-alert-close");
    btn?.click();
    expect(fired).toBe(true);
  });

  // ---- Slot ----

  it("renders slot content inside the alert", async () => {
    el.innerHTML = "Something went wrong";
    await el.updateComplete;
    expect(el.textContent).toBe("Something went wrong");
  });

  // ---- Role ----

  it("has role=alert on the inner div", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("[role='alert']")).not.toBeNull();
  });
});
