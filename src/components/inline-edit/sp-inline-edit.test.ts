import { describe, it, expect, beforeEach } from "vitest";
import "./sp-inline-edit.js";
import type { SpInlineEditComponent } from "./sp-inline-edit.js";

function createElement(): SpInlineEditComponent {
  const el = document.createElement("sp-inline-edit") as SpInlineEditComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-inline-edit", () => {
  let el: SpInlineEditComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders display element in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-inline-edit-display")).not.toBeNull();
  });

  it("shows empty text when value is empty", async () => {
    el.emptyText = "Click para editar";
    await el.updateComplete;
    const display = el.shadowRoot?.querySelector(".sp-inline-edit-display");
    expect(display?.textContent).toContain("Click para editar");
  });

  it("shows value text when value is set", async () => {
    el.value = "Mi texto";
    await el.updateComplete;
    const display = el.shadowRoot?.querySelector(".sp-inline-edit-display");
    expect(display?.textContent).toContain("Mi texto");
  });

  it("enters edit mode on click", async () => {
    await el.updateComplete;
    const display = el.shadowRoot?.querySelector<HTMLElement>(".sp-inline-edit-display");
    display?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-inline-edit-input")).not.toBeNull();
  });

  it("shows confirm and cancel buttons in edit mode", async () => {
    el.editing = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-inline-edit-btn--confirm")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-inline-edit-btn--cancel")).not.toBeNull();
  });

  it("fires sp-edit-start when editing begins", async () => {
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-edit-start", (e) => received.push(e as CustomEvent));
    const display = el.shadowRoot?.querySelector<HTMLElement>(".sp-inline-edit-display");
    display?.click();
    expect(received.length).toBe(1);
  });

  it("fires sp-change when value is confirmed", async () => {
    el.value = "original";
    await el.updateComplete;
    el.editing = true;
    await el.updateComplete; // updated() sets _draft = this.value = "original"
    el._draft = "nuevo";     // override draft after the editing=true cycle
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-change", (e) => received.push(e as CustomEvent));
    const confirmBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-inline-edit-btn--confirm");
    confirmBtn?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.value).toBe("nuevo");
  });

  it("fires sp-edit-cancel when cancelled", async () => {
    el.editing = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-edit-cancel", (e) => received.push(e as CustomEvent));
    const cancelBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-inline-edit-btn--cancel");
    cancelBtn?.click();
    expect(received.length).toBe(1);
  });

  it("does not enter edit mode when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const display = el.shadowRoot?.querySelector<HTMLElement>(".sp-inline-edit-display");
    display?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-inline-edit-input")).toBeNull();
  });
});
