import { describe, it, expect, beforeEach } from "vitest";
import "./sp-phone-input.js";
import type { SpPhoneInputComponent } from "./sp-phone-input.js";

function createElement(): SpPhoneInputComponent {
  const el = document.createElement("sp-phone-input") as SpPhoneInputComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-phone-input", () => {
  let el: SpPhoneInputComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders phone container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-phone-container")).not.toBeNull();
  });

  it("renders phone input element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-phone-input")).not.toBeNull();
  });

  it("renders country selector button", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-phone-country-btn")).not.toBeNull();
  });

  it("defaults country to US", async () => {
    await el.updateComplete;
    expect(el.country).toBe("US");
  });

  it("shows dial code", async () => {
    await el.updateComplete;
    const dial = el.shadowRoot?.querySelector(".sp-phone-dial");
    expect(dial?.textContent?.trim()).toBeTruthy();
    expect(dial?.textContent?.trim()).toContain("+1");
  });

  it("opens country dropdown on button click", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-phone-country-btn");
    btn?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-phone-dropdown")).not.toBeNull();
  });

  it("renders search input in dropdown", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-phone-country-btn");
    btn?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-phone-search")).not.toBeNull();
  });

  it("fires sp-input on number input", async () => {
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-input", (e) => received.push(e as CustomEvent));
    const input = el.shadowRoot?.querySelector<HTMLInputElement>(".sp-phone-input");
    input!.value = "5551234";
    input?.dispatchEvent(new Event("input", { bubbles: true }));
    expect(received.length).toBe(1);
  });

  it("shows label when set", async () => {
    el.label = "Teléfono";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-phone-label")?.textContent).toContain("Teléfono");
  });

  it("shows error class when error is set", async () => {
    el.error = "Número inválido";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-phone-container--error")).not.toBeNull();
  });
});
