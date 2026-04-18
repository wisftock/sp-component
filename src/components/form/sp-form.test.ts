import { describe, it, expect, beforeEach } from "vitest";
import "./sp-form.js";
import type { SpFormComponent } from "./sp-form.js";

function createElement(): SpFormComponent {
  const el = document.createElement("sp-form") as SpFormComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-form", () => {
  let el: SpFormComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders form element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("form")).not.toBeNull();
  });

  it("renders default slot", async () => {
    el.innerHTML = "<input name='username'>";
    await el.updateComplete;
    expect(el.querySelector("input")).not.toBeNull();
  });

  it("defaults novalidate to false", async () => {
    await el.updateComplete;
    expect(el.novalidate).toBe(false);
  });

  it("fires sp-submit on valid form submit", async () => {
    el.novalidate = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-submit", (e) => received.push(e as CustomEvent));
    const form = el.shadowRoot?.querySelector<HTMLFormElement>("form");
    form?.dispatchEvent(new SubmitEvent("submit", { bubbles: true, cancelable: true }));
    expect(received.length).toBe(1);
    expect(received[0].detail.formData).toBeInstanceOf(FormData);
  });

  it("fires sp-reset on form reset", async () => {
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-reset", (e) => received.push(e as CustomEvent));
    const form = el.shadowRoot?.querySelector<HTMLFormElement>("form");
    form?.dispatchEvent(new Event("reset", { bubbles: true }));
    expect(received.length).toBe(1);
  });

  it("checkValidity returns true for empty form", async () => {
    await el.updateComplete;
    expect(el.checkValidity()).toBe(true);
  });

  it("reset method calls form reset", async () => {
    await el.updateComplete;
    let resetFired = false;
    el.addEventListener("sp-reset", () => { resetFired = true; });
    el.reset();
    expect(resetFired).toBe(true);
  });
});
