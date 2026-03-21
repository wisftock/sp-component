import { describe, it, expect, beforeEach } from "vitest";
import "./sp-navbar.js";
import type { SpNavbarComponent } from "./sp-navbar.js";

function createElement(): SpNavbarComponent {
  const el = document.createElement("sp-navbar") as SpNavbarComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-navbar", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders a header element in shadow DOM", async () => {
    const el = createElement();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("header.sp-navbar")).not.toBeNull();
  });

  it("renders start slot container", async () => {
    const el = createElement();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-navbar-start")).not.toBeNull();
  });

  it("renders center slot container", async () => {
    const el = createElement();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-navbar-center")).not.toBeNull();
  });

  it("renders end slot container", async () => {
    const el = createElement();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-navbar-end")).not.toBeNull();
  });

  it("is not fixed by default", async () => {
    const el = createElement();
    await el.updateComplete;
    expect(el.fixed).toBe(false);
    expect(el.hasAttribute("fixed")).toBe(false);
  });

  it("reflects fixed attribute when set", async () => {
    const el = createElement();
    el.fixed = true;
    await el.updateComplete;
    expect(el.hasAttribute("fixed")).toBe(true);
  });

  it("is not bordered by default", async () => {
    const el = createElement();
    await el.updateComplete;
    expect(el.bordered).toBe(false);
    expect(el.hasAttribute("bordered")).toBe(false);
  });

  it("reflects bordered attribute when set", async () => {
    const el = createElement();
    el.bordered = true;
    await el.updateComplete;
    expect(el.hasAttribute("bordered")).toBe(true);
  });

  it("is not transparent by default", async () => {
    const el = createElement();
    await el.updateComplete;
    expect(el.transparent).toBe(false);
    expect(el.hasAttribute("transparent")).toBe(false);
  });

  it("reflects transparent attribute when set", async () => {
    const el = createElement();
    el.transparent = true;
    await el.updateComplete;
    expect(el.hasAttribute("transparent")).toBe(true);
  });

  it("renders slotted content in start slot", async () => {
    const el = createElement();
    const logo = document.createElement("span");
    logo.setAttribute("slot", "start");
    logo.textContent = "Logo";
    el.appendChild(logo);
    await el.updateComplete;
    expect(el.querySelector("[slot='start']")?.textContent).toBe("Logo");
  });

  it("renders slotted content in end slot", async () => {
    const el = createElement();
    const action = document.createElement("button");
    action.setAttribute("slot", "end");
    action.textContent = "Login";
    el.appendChild(action);
    await el.updateComplete;
    expect(el.querySelector("[slot='end']")?.textContent).toBe("Login");
  });
});
